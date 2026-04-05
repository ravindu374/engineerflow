from celery import Celery
from app.core.config import settings

celery = Celery(
    "engineerflow",
    broker=settings.redis_url,
    backend=settings.redis_url,
)

# IMPORTANT: explicitly include task module
celery.conf.update(
    imports=["app.workers.tasks"]
)