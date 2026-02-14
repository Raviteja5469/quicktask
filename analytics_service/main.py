from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId  # <--- Make sure this is imported
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

# ⚠️ CRITICAL CHECK: Ensure 'quicktask' matches the DB name in your Atlas URI
# If your URI is ...mongodb.net/test?..., change this to client.test
db = client.quicktask 
tasks_collection = db.tasks

@app.get("/")
def read_root():
    return {"message": "Analytics Service is Running"}

@app.get("/analytics/{user_id}")
def get_user_analytics(user_id: str):
    try:
        # 1. CONVERT STRING ID TO OBJECTID
        # Node.js Mongoose stores user references as ObjectIds, not strings.
        try:
            user_oid = ObjectId(user_id)
        except:
            raise HTTPException(status_code=400, detail="Invalid User ID format")

        # 2. USE OBJECTID IN QUERY
        query = {"user": user_oid} 
        
        # Debug Print (Optional: Check your terminal to see if it finds docs)
        count = tasks_collection.count_documents(query)
        print(f"Found {count} tasks for user {user_id}")

        # --- AGGREGATION LOGIC ---
        
        # 1. Overview Stats
        total_tasks = tasks_collection.count_documents(query)
        completed_tasks = tasks_collection.count_documents({**query, "status": "completed"})
        pending_tasks = tasks_collection.count_documents({**query, "status": "pending"})
        in_progress_tasks = tasks_collection.count_documents({**query, "status": "in-progress"})
        
        completion_rate = 0
        if total_tasks > 0:
            completion_rate = round((completed_tasks / total_tasks) * 100)

        # 2. Weekly Productivity (Last 7 Days)
        seven_days_ago = datetime.now() - timedelta(days=7)
        pipeline = [
            {
                "$match": {
                    "user": user_oid, # Use ObjectId here too
                    "status": "completed",
                    # Note: Ensure your tasks actually HAVE 'updatedAt' field
                    # If not, this part will return 0. 
                    "updatedAt": {"$gte": seven_days_ago}
                }
            },
            {
                "$group": {
                    "_id": { "$dayOfWeek": "$updatedAt" },
                    "count": { "$sum": 1 }
                }
            }
        ]
        weekly_data = list(tasks_collection.aggregate(pipeline))
        
        # Map MongoDB day numbers (1=Sun) to names
        days_map = {1: "Sun", 2: "Mon", 3: "Tue", 4: "Wed", 5: "Thu", 6: "Fri", 7: "Sat"}
        formatted_weekly = [{"name": day, "completed": 0} for day in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]]
        
        for item in weekly_data:
            day_name = days_map.get(item["_id"])
            for day_obj in formatted_weekly:
                if day_obj["name"] == day_name:
                    day_obj["completed"] = item["count"]

        # 3. Task Distribution by Priority
        high = tasks_collection.count_documents({**query, "priority": "high"})
        medium = tasks_collection.count_documents({**query, "priority": "medium"})
        low = tasks_collection.count_documents({**query, "priority": "low"})

        return {
            "overview": [
                {"label": "Total Tasks", "value": total_tasks, "iconName": "Layout"},
                {"label": "In Progress", "value": in_progress_tasks, "iconName": "Clock", "positive": True},
                {"label": "Completed", "value": completed_tasks, "iconName": "CheckCircle", "positive": True},
                {"label": "Efficiency", "value": f"{completion_rate}%", "iconName": "TrendingUp", "positive": True}
            ],
            "kpi": [
                {"label": "Completion Rate", "value": f"{completion_rate}%"},
                {"label": "Tasks Completed", "value": completed_tasks},
                {"label": "Pending", "value": pending_tasks}
            ],
            "weeklyProductivity": formatted_weekly,
            "taskDistribution": [
                {"name": "High", "value": high},
                {"name": "Medium", "value": medium},
                {"name": "Low", "value": low}
            ]
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)