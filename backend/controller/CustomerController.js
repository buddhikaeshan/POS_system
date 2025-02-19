const Customer = require("../model/Customer");
const { Op } = require('sequelize');

async function createCustomer(req, res) {
    try {
        const { cusName, cusAddress, cusPhone, cusJob, cusOffice, cusStore, cusEmail } = req.body;

        // Validate required fields
        if (!cusName || !cusAddress || !cusStore) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Generate cusCode
        const lastCustomer = await Customer.findOne({
            order: [["cusCode", "DESC"]],
        });

        const lastCusCode = lastCustomer?.cusCode || "CUS000";
        const lastNumber = parseInt(lastCusCode.slice(3), 10);
        const newNumber = lastNumber + 1;
        const cusCode = `CUS${newNumber.toString().padStart(3, "0")}`;

        // Create new Customer
        const newCustomer = await Customer.create({
            cusName,
            cusCode,
            cusAddress,
            cusPhone,
            cusJob,
            cusOffice,
            cusStore,
            cusEmail,
        });

        // Return success response
        return res.status(201).json({ message: "Customer created successfully.", newCustomer });

    } catch (error) {
        // Handle Sequelize validation errors
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({ error: "Validation error: Please check the provided data." });
        }

        // Handle Sequelize unique constraint errors
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({ error: "Customer already exists." });
        }

        // Catch all other errors
        return res.status(500).json({ error: `An internal server error occurred: ${error.message}` });
    }
}


async function getAllCustomers(req, res) {
    try {
        const customer = await Customer.findAll();
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getCustomerById(req, res) {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);

        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateCustomer(req, res) {
    try {
        const { id } = req.params;
        const {
            cusName,
            cusAddress,
            cusPhone,
            cusJob,
            cusOffice,
            cusStore,
            cusEmail
        } = req.body;

        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        await customer.update({
            cusName,
            cusAddress,
            cusPhone,
            cusJob,
            cusOffice,
            cusStore,
            cusEmail
        });

        res.status(200).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


async function deleteCustomer(req, res) {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);
        
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        
        await customer.destroy();
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        // Check for foreign key constraint error
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ 
                error: "Cannot delete customer because they have associated records"
            });
        }
        res.status(500).json({ error: error.message });
    }
}

async function getCustomerByCode(req, res) {
    try {
        const { code } = req.params;

        const customer = await Customer.findOne({
            where: { cusCode: code }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        } customer
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getCustomerByName(req, res) {
    try {
        const { name } = req.params;

        const customer = await Customer.findOne({
            where: { cusName: name }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        } customer
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getCustomerSuggestions(req, res) {
    try {
        const { query } = req.query;

        if (!query || query.length < 2) {
            return res.status(400).json({ message: 'Query must be at least 2 characters long' });
        }

        const customer = await Customer.findAll({
            where: {
                [Op.or]: [
                    { cusName: { [Op.like]: `%${query}%` } },
                ]
            },
            attributes: ['cusName'],
            limit: 10
        });

        res.status(200).json(customer);
    } catch (error) {
        console.error('Error fetching product suggestions:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getCustomerSuggestion(req, res) {
    try {
        const { name } = req.query; // Ensure this matches the query parameter name

        if (!name || name.length < 2) {
            return res.status(400).json({ message: 'Query must be at least 2 characters long' });
        }

        const customers = await Customer.findAll({
            where: {
                cusName: {
                    [Op.like]: `%${name}%`, // Search for customers with names containing the input
                },
            },
            limit: 10, // Limit the number of suggestions
        });

        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customer suggestions:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    getCustomerByCode,
    getCustomerByName,
    getCustomerSuggestions,
    getCustomerSuggestion

}