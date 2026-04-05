from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.task_repository import TaskRepository


class TaskService:
    def __init__(self):
        self.task_repo = TaskRepository()

    async def create_task(self, db: AsyncSession, task_data: dict):
        return await self.task_repo.create(db, task_data)

    async def get_tasks_by_project(self, db: AsyncSession, project_id):
        return await self.task_repo.get_by_project(db, project_id)