from pydantic import BaseModel
from uuid import UUID
from app.models.task import TaskStatus


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    project_id: UUID
    assignee_id: UUID | None = None


class TaskResponse(BaseModel):
    id: UUID
    title: str
    description: str | None
    status: TaskStatus
    project_id: UUID
    assignee_id: UUID | None

    class Config:
        from_attributes = True