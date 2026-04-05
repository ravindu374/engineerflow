import enum

from sqlalchemy import Column, String, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class TaskStatus(str, enum.Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"


class Task(BaseModel):
    __tablename__ = "tasks"

    title = Column(String, nullable=False)
    description = Column(String, nullable=True)

    status = Column(Enum(TaskStatus), default=TaskStatus.TODO)

    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    assignee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="tasks")