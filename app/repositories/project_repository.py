from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.project import Project
from app.repositories.base import BaseRepository


class ProjectRepository(BaseRepository[Project]):
    def __init__(self):
        super().__init__(Project)

    async def get_by_owner(self, db: AsyncSession, owner_id):
        result = await db.execute(
            select(Project).where(Project.owner_id == owner_id)
        )
        return result.scalars().all()