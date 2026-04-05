from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.project_repository import ProjectRepository
from app.services.activity_service import ActivityService
from app.workers.tasks import send_email_task

class ProjectService:
    def __init__(self):
        self.project_repo = ProjectRepository()
        self.activity_service = ActivityService()

    async def create_project(self, db, project_data: dict,user_email: str):
        project = await self.project_repo.create(db, project_data)

        # log activity
        await self.activity_service.log_activity(
            str(project.owner_id),
            "CREATE_PROJECT",
            {"project_id": str(project.id), "name": project.name},
        )

        # send async email
        send_email_task.delay(
            user_email,
            "Project Created",
            f"Project {project.name} created successfully"
        )

        return project

    async def get_projects_by_user(self, db: AsyncSession, user_id):
        return await self.project_repo.get_by_owner(db, user_id)