-- Fix the illogical meter reading validation trigger
-- This will allow professional meter reading scenarios

-- Drop the existing trigger
DROP TRIGGER IF EXISTS `before_meter_reading_insert`;

-- Create a new professional trigger
DELIMITER $$

CREATE TRIGGER `before_meter_reading_insert`
BEFORE INSERT ON `meter_readings`
FOR EACH ROW
BEGIN
  -- Only validate that readings are not negative (logical constraint)
  IF NEW.current_reading < 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Reading cannot be negative';
  END IF;

  -- Calculate units consumed (can be negative for meter replacement/rollover)
  SET NEW.units_consumed = NEW.current_reading - NEW.previous_reading;
END$$

DELIMITER ;

