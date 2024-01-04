from datetime import datetime, timedelta
def get_dates(collection_data, date_type, date=None):
    parsed_dates = [date_str for date_str in collection_data]
    
    if date_type == "one_day":
        if date:
            date_to_check = date + "_uxlivinglab_org"
            if date_to_check in parsed_dates:
                return [date_to_check], []
            else:
                return [], [date_to_check]
    
    elif date_type == "seven_days":
        if date:
            seven_days_ago = [(datetime.strptime(date, "%d_%m_%Y") - timedelta(days=i)).strftime("%d_%m_%Y") + "_uxlivinglab_org" for i in range(7)]
            present_dates = [d for d in seven_days_ago if d in parsed_dates]
            not_present_dates = [d for d in seven_days_ago if d not in parsed_dates]
            
            return present_dates, not_present_dates
    
    elif date_type == "one_month":
        if date:
            one_month_ago = [(datetime.strptime(date, "%d_%m_%Y") - timedelta(days=i)).strftime("%d_%m_%Y") + "_uxlivinglab_org" for i in range(30)]
            present_dates = [d for d in one_month_ago if d in parsed_dates]
            not_present_dates = [d for d in one_month_ago if d not in parsed_dates]
            
            return present_dates, not_present_dates
    
    return [], []

# Your example usage
collection_data = [
    "13_12_2023_uxlivinglab_org",
    "15_12_2023_uxlivinglab_org",
    "03_01_2024_uxlivinglab_org",
    "12_12_2023_uxlivinglab_org",
    "10_12_2023_uxlivinglab_org",
    "01_01_2024_uxlivinglab_org",
    "02_01_2024_uxlivinglab_org",
    "18_12_2023_uxlivinglab_org",
    "04_01_2024_uxlivinglab_org",
    "23_12_2023_uxlivinglab_org",
    "30_12_2023_uxlivinglab_org",
    "11_12_2023_uxlivinglab_org",
    "22_12_2023_uxlivinglab_org",
    "14_12_2023_uxlivinglab_org",
    "25_12_2023_uxlivinglab_org",
    "17_12_2023_uxlivinglab_org",
    "16_12_2023_uxlivinglab_org"
]

date_input = "04_01_2024"
date_type = "seven_days"  # Change this to test different date types

present_dates, not_present_dates = get_dates(collection_data, date_type, date_input)
print("Dates present in collection data:", present_dates)
print("Dates not present in collection data:", not_present_dates)
