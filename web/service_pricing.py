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
        }

    def get_price(self, item):
        """
        Returns the price for a given service item.
        item: CleaningTier or HandymanJob enum

        Returns: float price or 0.0 if not found.
        """
        if isinstance(item, CleaningJob):
            return self.cleaning_prices.get(item, 0.0)
        elif isinstance(item, HandymanJob):
            return self.handyman_prices.get(item, 0.0)
        else:
            return 0.0

    def list_all_prices(self):
        return {
            "cleaning": {job.value: price for job, price in self.cleaning_prices.items()},
            "handyman": {job.value: price for job, price in self.handyman_prices.items()}
        }