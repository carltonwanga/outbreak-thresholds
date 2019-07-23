Calendar calendar = new GregorianCalendar();
Date currentTime = new Date();
calendar.setTime(currentTime);
System.out.println("Day of week:" +
        calendar.get(Calendar.DAY_OF_WEEK));