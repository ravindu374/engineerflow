from typing import Generic, Type, TypeVar, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

T = TypeVar("T")


class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T]):
        self.model = model

    async def get(self, db: AsyncSession, obj_id) -> Optional[T]:
        result = await db.execute(
            select(self.model).where(self.model.id == obj_id)
        )
        return result.scalar_one_or_none()

    async def get_all(self, db: AsyncSession) -> List[T]:
        result = await db.execute(select(self.model))
        return result.scalars().all()

    async def create(self, db: AsyncSession, obj_in: dict) -> T:
        obj = self.model(**obj_in)
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return obj

    async def delete(self, db: AsyncSession, obj_id) -> None:
        obj = await self.get(db, obj_id)
        if obj:
            await db.delete(obj)
            await db.commit()