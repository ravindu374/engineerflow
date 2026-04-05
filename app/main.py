from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth
from app.api.v1 import users
from app.api.v1 import projects
from app.api.v1 import tasks

from app.models import user, project, task

app = FastAPI(title="EngineerFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])

app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])

app.include_router(projects.router, prefix="/api/v1/projects", tags=["Projects"])

app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["Tasks"])