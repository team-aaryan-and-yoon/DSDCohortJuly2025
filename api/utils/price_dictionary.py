from enum import Enum

class CleaningJob(Enum):
    SINGLE_ROOM = "single_room"
    APARTMENT = "apartment"
    HOUSE = "house"

class HandymanJob(Enum):
    FIX_DOOR = "fix_door"
    FIX_SINK = "fix_sink"
    INSTALL_SHELF = "install_shelf"
    MOUNT_TV = "mount_tv"
    PAINTING = "painting"
    YARD_WORK = "yard_work"
    FURNITURE_ASSEMBLY = "furniture_assembly"
    DRYWALL_REPAIR = "drywall_repair"
    LIGHT_FIXTURE_INSTALLATION = "light_fixture_installation"
    APPLIANCE_INSTALLATION = "appliance_installation"
    FAUCET_REPLACEMENT = "faucet_replacement"
    TOILET_REPAIR = "toilet_repair"


class ServicePricing:
    def __init__(self):
        self.cleaning_prices = {
            CleaningJob.SINGLE_ROOM: 50.0,
            CleaningJob.APARTMENT: 80.0,
            CleaningJob.HOUSE: 120.0,
        }

        self.handyman_prices = {
            HandymanJob.FIX_DOOR: 45.0,
            HandymanJob.FIX_SINK: 60.0,
            HandymanJob.INSTALL_SHELF: 55.0,
            HandymanJob.MOUNT_TV: 70.0,
            HandymanJob.PAINTING: 150.0,
            HandymanJob.YARD_WORK: 75.0,
            HandymanJob.FURNITURE_ASSEMBLY: 90.0,
            HandymanJob.DRYWALL_REPAIR: 110.0,
            HandymanJob.LIGHT_FIXTURE_INSTALLATION: 65.0,
            HandymanJob.APPLIANCE_INSTALLATION: 100.0,
            HandymanJob.FAUCET_REPLACEMENT: 70.0,
            HandymanJob.TOILET_REPAIR: 80.0,
        }