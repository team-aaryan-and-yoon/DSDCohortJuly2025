# get_user_price.py

# Import the necessary classes and enums from our service_pricing module
# Changed CleaningTier to CleaningJob
from service_pricing import ServicePricing, CleaningJob, HandymanJob

def main():
    """
    Main function to list all prices and then get user input for a specific service.
    """
    print("Welcome to the Service Price Estimator!")
    print("--- All Available Services and Prices ---")

    # Create an instance of the ServicePricing class
    pricing = ServicePricing()

    # Get and display all prices
    all_prices = pricing.list_all_prices()

    print("\nCleaning Services:")
    # Changed 'tier' to 'job' to reflect CleaningJob enum
    for job_name, price in all_prices["cleaning"].items():
        # Format for display: SINGLE_ROOM -> Single Room
        display_job_name = job_name.replace('_', ' ').title()
        print(f"  - CleaningJob.{job_name.upper()}: ${price:.2f}")

    print("\nHandyman Services:")
    for job_name, price in all_prices["handyman"].items():
        # Format job name for display (e.g., FIX_DOOR -> Fix Door)
        display_job_name = job_name.replace('_', ' ').title()
        print(f"  - HandymanJob.{job_name.upper()}: ${price:.2f}")

    # Create a mapping from string names to actual Enum classes for easy lookup
    # Changed "CleaningTier" to "CleaningJob"
    enum_types = {
        "CleaningJob": CleaningJob, # Updated
        "HandymanJob": HandymanJob
    }

    print("\n-----------------------------------------")
    print("Enter the full service item (e.g., CleaningJob.SINGLE_ROOM or HandymanJob.FIX_SINK).")
    print("Press Enter without typing anything to exit.")
    print("-----------------------------------------")

    while True:
        user_input = input("\nEnter service item: ").strip()

        if not user_input: # If input is empty
            print("Exiting Service Price Estimator. Goodbye!")
            break

        try:
            # Split the input into Enum class name and member name
            parts = user_input.split('.')
            if len(parts) != 2:
                print("Invalid format. Please use 'EnumClass.ENUM_MEMBER' (e.g., CleaningJob.SINGLE_ROOM).")
                continue

            enum_class_name_str = parts[0]
            enum_member_name_str = parts[1]

            # Get the actual Enum class object from our mapping
            enum_class = enum_types.get(enum_class_name_str)

            if enum_class is None:
                print(f"Unknown service type: '{enum_class_name_str}'. Please use CleaningJob or HandymanJob.")
                continue

            # Get the actual Enum member object (e.g., CleaningJob.SINGLE_ROOM)
            selected_item = getattr(enum_class, enum_member_name_str.upper()) # .upper() for robustness

            # Get the price using the get_price method
            price = pricing.get_price(selected_item)

            if price > 0:
                # For display, reformat the input for clarity
                # e.g., "CleaningJob.SINGLE_ROOM" -> "Cleaning Job: Single Room"
                display_enum_class = enum_class_name_str.replace('Job', ' Job')
                display_enum_member = enum_member_name_str.replace('_', ' ').title()
                print(f"The price for {display_enum_class}: {display_enum_member} is: ${price:.2f}")
            else:
                print(f"Could not find a price for '{user_input}'. Please check the spelling.")

        except AttributeError:
            # This handles cases where the member name doesn't exist within the enum
            print(f"Invalid service item: '{user_input}'. The member does not exist in {enum_class_name_str}.")
        except Exception as e:
            # Catch any other unexpected errors
            print(f"An unexpected error occurred: {e}. Please try again.")

# This ensures that main() is called only when the script is executed directly
if __name__ == "__main__":
    main()