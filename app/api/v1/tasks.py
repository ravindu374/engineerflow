from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.deps import get_db
from app.services.task_service import TaskService
from app.schemas.task import TaskCreate, TaskResponse
from app.core.deps import get_current_user
from app.repositories.project_repository import ProjectRepository

router = APIRouter()
task_service = TaskService()
project_repo = ProjectRepository()


@router.post("/", response_model=TaskResponse)
async def create_task(
    task: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # check project ownership
    project = await project_repo.get(db, task.project_id)

    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return await task_service.create_task(db, task.model_dump())

@router.get("/{project_id}", response_model=list[TaskResponse])
async def get_tasks(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    project = await project_repo.get(db, project_id)

    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return await task_service.get_tasks_by_project(db, project_id)

@router.put("/{task_id}/status")
async def update_task_status(
    task_id: str,
    status: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    task = await task_service.task_repo.get(db, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # check ownership via project
    project = await project_repo.get(db, task.project_id)

    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    task.status = status
    await db.commit()
    await db.refresh(task)

    return task