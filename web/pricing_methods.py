


	# Pricing depends on number rooms and bathrooms.
	# $60 / per rooms.
	# $30 / per bathroom.
    # Ideally the price would be received in "input_data", the admin should be able to set the price for each service.
	# Pricing per room and bathroom will makes it easy to price regardless of how big a house or appartment may be.
	# We can input the number of rooms and bathrooms in a list.
	# data would be a dictionary.

    # input data example:

    # input_data = {"service": "cleaning", "data" : [{"num": 3, "price": 60},
    #                                               {"num": 2, "price": 30}
    #                                               ]
    #                    }

    # input_data = {"service": "handyman", "data": [{service: "fixing door", "price": 100}]}


class PricingCalculator:
    """A class to calculate the total price for services based on input data.
    The class supports different services like cleaning and handyman, each with its own pricing logic."""

    def calculate(self):
        
        if self.service == "cleaning":
            total_price = 0
            for item in self.data:
                total_price += item["num"] * item["[price"]
            return total_price
        
        elif self.service == "handyman":
            total_price = 0
            for item in self.data:
                total_price += item["price"]
            # Assuming handyman service has a fixed price for simplicity
            return total_price
        
        else:
            raise ValueError("Service not recognized. Please provide a valid service type.")


    def __init__(self, input_data):
        self.service = input_data["service"]
        self.data = input_data["data"]