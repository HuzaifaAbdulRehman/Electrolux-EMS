-- Add assignedEmployeeId field to customers table for tracking meter installation assignments
ALTER TABLE customers
ADD COLUMN assigned_employee_id INT DEFAULT NULL AFTER zone,
ADD CONSTRAINT fk_customers_assigned_employee
    FOREIGN KEY (assigned_employee_id)
    REFERENCES employees(id)
    ON DELETE SET NULL;