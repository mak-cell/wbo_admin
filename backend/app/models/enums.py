"""Enumerations for the database models."""
import enum


class RoleEnum(enum.Enum):
    """User roles."""
    ADMIN = "Admin"
    SHOOTER = "Shooter"
    EDITOR = "Editor"


class ProjectStatusEnum(enum.Enum):
    """Project status."""
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    REVIEW = "Review"
    DELIVERED = "Delivered"
    COMPLETED = "Completed"
