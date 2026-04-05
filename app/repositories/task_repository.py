from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.task import Task
from app.repositories.base import BaseRepository


class TaskRepository(BaseRepository[Task]):
    def __init__(self):
        super().__init__(Task)

    async def get_by_project(self, db: AsyncSession, project_id):
        result = await db.execute(
            select(Task).where(Task.project_id == project_id)
        )
        return result.scalars().all()