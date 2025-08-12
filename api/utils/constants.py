from datetime import timedelta
from django.db import models


class Role(models.TextChoices):
    CLIENT = "client", "Client"
    PROVIDER = "provider", "Provider"


class ServiceType(models.TextChoices):
    CLEANING = "cleaning", "Cleaning"
    MAINTENANCE = "maintenance", "Maintenance"


class StatusChoices(models.TextChoices):
    SCHEDULED = "scheduled", "Scheduled"
    ON_THE_WAY = "on-the-way", "On the way"
    IN_PROGRESS = "in-progress", "In progress"
    COMPLETED = "completed", "Completed"


class CleaningJobs(models.TextChoices):
    SINGLE_ROOM = "single_room", "Single Room"
    APARTMENT = "apartment", "Apartment"
    HOUSE = "house", "House"


class MaintenanceJobs(models.TextChoices):
    FIX_DOOR = "fix_door", "Fix Door"
    FIX_SINK = "fix_sink", "Fix Sink"
    INSTALL_SHELF = "install_shelf", "Install Shelf"
    MOUNT_TV = "mount_tv", "Mount TV"
    PAINTING = "painting", "Painting"
    YARD_WORK = "yard_work", "Yard Work"
    FURNITURE_ASSEMBLY = "furniture_assembly", "Furniture Assembly"
    DRYWALL_REPAIR = "drywall_repair", "Drywall Repair"
    LIGHT_FIXTURE_INSTALLATION = (
        "light_fixture_installation",
        "Light Fixture Installation",
    )
    APPLIANCE_INSTALLATION = "appliance_installation", "Appliance Installation"
    FAUCET_REPLACEMENT = "faucet_replacement", "Faucet Replacement"
    TOILET_REPAIR = "toilet_repair", "Toilet Repair"


# For durations, prices, and descriptions, you can keep dicts keyed by the enum values

DURATIONS = {
    CleaningJobs.SINGLE_ROOM: timedelta(hours=1),
    CleaningJobs.APARTMENT: timedelta(hours=3),
    CleaningJobs.HOUSE: timedelta(hours=5),
    MaintenanceJobs.FIX_DOOR: timedelta(hours=1),
    MaintenanceJobs.FIX_SINK: timedelta(hours=1),
    MaintenanceJobs.INSTALL_SHELF: timedelta(minutes=45),
    MaintenanceJobs.MOUNT_TV: timedelta(minutes=45),
    MaintenanceJobs.PAINTING: timedelta(hours=4),
    MaintenanceJobs.YARD_WORK: timedelta(hours=2),
    MaintenanceJobs.FURNITURE_ASSEMBLY: timedelta(hours=2),
    MaintenanceJobs.DRYWALL_REPAIR: timedelta(hours=3),
    MaintenanceJobs.LIGHT_FIXTURE_INSTALLATION: timedelta(hours=1, minutes=30),
    MaintenanceJobs.APPLIANCE_INSTALLATION: timedelta(hours=2),
    MaintenanceJobs.FAUCET_REPLACEMENT: timedelta(hours=1),
    MaintenanceJobs.TOILET_REPAIR: timedelta(hours=1, minutes=15),
}

PRICES = {
    CleaningJobs.SINGLE_ROOM: 50.0,
    CleaningJobs.APARTMENT: 80.0,
    CleaningJobs.HOUSE: 120.0,
    MaintenanceJobs.FIX_DOOR: 45.0,
    MaintenanceJobs.FIX_SINK: 60.0,
    MaintenanceJobs.INSTALL_SHELF: 55.0,
    MaintenanceJobs.MOUNT_TV: 70.0,
    MaintenanceJobs.PAINTING: 150.0,
    MaintenanceJobs.YARD_WORK: 75.0,
    MaintenanceJobs.FURNITURE_ASSEMBLY: 90.0,
    MaintenanceJobs.DRYWALL_REPAIR: 110.0,
    MaintenanceJobs.LIGHT_FIXTURE_INSTALLATION: 65.0,
    MaintenanceJobs.APPLIANCE_INSTALLATION: 100.0,
    MaintenanceJobs.FAUCET_REPLACEMENT: 70.0,
    MaintenanceJobs.TOILET_REPAIR: 80.0,
}

DESCRIPTIONS = {
    CleaningJobs.SINGLE_ROOM: "A thorough cleaning of a single room including dusting, vacuuming, and surface wiping. Ideal for quick refreshes or small spaces.",
    CleaningJobs.APARTMENT: "Comprehensive cleaning for an entire apartment, covering all rooms and common areas. Includes kitchen, bathroom, floors, and dusting.",
    CleaningJobs.HOUSE: "Deep cleaning for a full house, addressing every room and surface in detail. Perfect for seasonal cleaning or move-in/move-out preparation.",
    MaintenanceJobs.FIX_DOOR: "Repair and adjust doors to ensure proper alignment and smooth operation. Includes fixing hinges, handles, and locks as needed.",
    MaintenanceJobs.FIX_SINK: "Troubleshoot and repair sink issues such as leaks, clogs, and faucet malfunctions. Ensures proper water flow and drainage.",
    MaintenanceJobs.INSTALL_SHELF: "Mount shelves securely on walls or other surfaces to provide additional storage space. Includes measuring, drilling, and anchoring.",
    MaintenanceJobs.MOUNT_TV: "Safely install wall mounts and secure televisions in desired locations. Includes cable management and alignment.",
    MaintenanceJobs.PAINTING: "Apply paint or touch-ups to walls, ceilings, and other surfaces. Prepares surfaces and ensures even, clean finishes.",
    MaintenanceJobs.YARD_WORK: "Perform outdoor tasks such as lawn mowing, trimming, weeding, and general yard cleanup. Keeps outdoor areas neat and healthy.",
    MaintenanceJobs.FURNITURE_ASSEMBLY: "Assemble flat-pack or disassembled furniture following manufacturer instructions. Ensures sturdy and correct construction.",
    MaintenanceJobs.DRYWALL_REPAIR: "Fix holes, cracks, and damages in drywall surfaces. Includes sanding, patching, and prepping for repainting.",
    MaintenanceJobs.LIGHT_FIXTURE_INSTALLATION: "Install or replace lighting fixtures including ceiling lights, wall sconces, and outdoor lamps. Ensures safe electrical connections.",
    MaintenanceJobs.APPLIANCE_INSTALLATION: "Set up and connect household appliances like dishwashers, ovens, and washing machines. Includes plumbing and electrical hookups.",
    MaintenanceJobs.FAUCET_REPLACEMENT: "Remove old faucets and install new models to improve function and aesthetics. Ensures leak-free and secure fittings.",
    MaintenanceJobs.TOILET_REPAIR: "Diagnose and fix toilet issues such as leaks, clogs, and flushing problems. Restores proper function and conserves water.",
}

IMAGE_URLS = {
    CleaningJobs.SINGLE_ROOM: "/images/cleaning.png",
    CleaningJobs.APARTMENT: "/images/cleaning.png",
    CleaningJobs.HOUSE: "/images/cleaning.png",
    MaintenanceJobs.FIX_DOOR: "/images/maintenance.png",
    MaintenanceJobs.FIX_SINK: "/images/maintenance.png",
    MaintenanceJobs.INSTALL_SHELF: "/images/maintenance.png",
    MaintenanceJobs.MOUNT_TV: "/images/maintenance.png",
    MaintenanceJobs.PAINTING: "/images/maintenance.png",
    MaintenanceJobs.YARD_WORK: "/images/maintenance.png",
    MaintenanceJobs.FURNITURE_ASSEMBLY: "/images/maintenance.png",
    MaintenanceJobs.DRYWALL_REPAIR: "/images/maintenance.png",
    MaintenanceJobs.LIGHT_FIXTURE_INSTALLATION: "/images/maintenance.png",
    MaintenanceJobs.APPLIANCE_INSTALLATION: "/images/maintenance.png",
    MaintenanceJobs.FAUCET_REPLACEMENT: "/images/maintenance.png",
    MaintenanceJobs.TOILET_REPAIR: "/images/maintenance.png",
}

REVIEWS = {
    CleaningJobs.SINGLE_ROOM: [
        {"reviewer": "John S", "comment": "cool service", "rating": 5}, 
        {"reviewer": "Bob M", "comment": "meh service", "rating": 3}, 
        {"reviewer": "Jane K", "comment": "she ate my burrito", "rating": 1},
    ],
    CleaningJobs.APARTMENT: [
        {"reviewer": "John M", "comment": "fine service", "rating": 4}, 
        {"reviewer": "Bob K", "comment": "fast service", "rating": 4}, 
        {"reviewer": "Jane L", "comment": "could be better", "rating": 3},
    ],
    MaintenanceJobs.APPLIANCE_INSTALLATION: [
        {"reviewer": "John S", "comment": "cool service", "rating": 5}, 
        {"reviewer": "Bob M", "comment": "meh service", "rating": 3}, 
        {"reviewer": "Jane K", "comment": "she ate my burrito", "rating": 1},
    ],
    MaintenanceJobs.DRYWALL_REPAIR: [
        {"reviewer": "John M", "comment": "fine service", "rating": 4}, 
        {"reviewer": "Bob K", "comment": "fast service", "rating": 4}, 
        {"reviewer": "Jane L", "comment": "could be better", "rating": 3},
    ]
}


CLEANING_SERVICES = [
    {
        "id": job.value,
        "name": job.label,
        "details": DESCRIPTIONS[job],
        "price": PRICES[job],
        "duration": DURATIONS[job],
        "reviews": REVIEWS.get(job, []),
        "image_url": IMAGE_URLS[job],
    }
    for job in CleaningJobs
]

MAINTENANCE_SERVICES = [
    {
        "id": job.value,
        "name": job.label,
        "details": DESCRIPTIONS[job],
        "price": PRICES[job],
        "duration": DURATIONS[job],
        "reviews": REVIEWS.get(job, []),
        "image_url": IMAGE_URLS[job],
    }
    for job in MaintenanceJobs
]


ALL_SERVICES = {
    ServiceType.CLEANING.value: CLEANING_SERVICES,
    ServiceType.MAINTENANCE.value: MAINTENANCE_SERVICES,
}