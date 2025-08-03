
from price_dictionary import ServicePricing, CleaningJob, HandymanJob


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