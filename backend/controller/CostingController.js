const { CostingHeader, CostingDetail } = require("../model/Costing");
const { Op } = require('sequelize');
const sequelize = require("../dbConfig");
const Customer = require("../model/Customer");

async function createDraft(req, res) {
    const t = await sequelize.transaction();

    try {
        const { headerData, detailsData } = req.body;

        const costingHeader = await CostingHeader.create({
            cusId: headerData.cusId, 
            total_amount: headerData.totalAmount,
            total_profit: headerData.totalProfit,
            status: headerData.status || 'draft',
            preparedBy: headerData.preparedBy, 
        }, { transaction: t });

        const costingDetails = await Promise.all(
            detailsData.map(detail =>
                CostingDetail.create({
                    costing_header_id: costingHeader.id,
                    description_customer: detail.descriptionCustomer,
                    product_code: detail.productCode,
                    needImage: detail.needImage || false,
                    description: detail.description,
                    warranty: detail.warranty,
                    supplier: detail.supplier,
                    unit_cost: detail.unitCost,
                    our_margin_percentage: detail.ourMarginPercentage,
                    our_margin_value: detail.ourMarginValue,
                    other_margin_percentage: detail.otherMarginPercentage,
                    other_margin_value: detail.otherMarginValue,
                    price_plus_margin: detail.pricePlusMargin,
                    selling_rate: detail.sellingRate,
                    selling_rate_rounded: detail.sellingRateRounded,
                    uom: detail.uom,
                    qty: detail.qty,
                    unit_price: detail.unitPrice,
                    discount_percentage: detail.discountPercentage,
                    discount_value: detail.discountValue,
                    discounted_price: detail.discountedPrice,
                    amount: detail.amount,
                    profit: detail.profit,
                }, { transaction: t })
            )
        );

        await t.commit();

        res.status(201).json({
            message: "Costing created successfully",
            header: costingHeader,
            details: costingDetails,
        });
    } catch (error) {
        await t.rollback();
        console.error('Error creating costing:', error);
        res.status(500).json({ error: error.message });
    }
}


async function createCosting(req, res) {
    const t = await sequelize.transaction();

    try {
        const { headerData, detailsData } = req.body;

        // Create header with snake_case fields
        const costingHeader = await CostingHeader.create({
            cusId: headerData.cusId, // Ensure cusId is included
            total_amount: headerData.totalAmount,
            total_profit: headerData.totalProfit,
            // status: headerData.status || 'draft',
            preparedBy: headerData.preparedBy, 
        }, { transaction: t });

        // Create details with snake_case fields
        const costingDetails = await Promise.all(
            detailsData.map(detail =>
                CostingDetail.create({
                    costing_header_id: costingHeader.id,
                    description_customer: detail.descriptionCustomer,
                    product_code: detail.productCode,
                    needImage: detail.needImage || false, // Ensure needImage is included
                    description: detail.description,
                    warranty: detail.warranty,
                    supplier: detail.supplier,
                    unit_cost: detail.unitCost,
                    our_margin_percentage: detail.ourMarginPercentage,
                    our_margin_value: detail.ourMarginValue,
                    other_margin_percentage: detail.otherMarginPercentage,
                    other_margin_value: detail.otherMarginValue,
                    price_plus_margin: detail.pricePlusMargin,
                    selling_rate: detail.sellingRate,
                    selling_rate_rounded: detail.sellingRateRounded,
                    uom: detail.uom,
                    qty: detail.qty,
                    unit_price: detail.unitPrice,
                    discount_percentage: detail.discountPercentage,
                    discount_value: detail.discountValue,
                    discounted_price: detail.discountedPrice,
                    amount: detail.amount,
                    profit: detail.profit,
                }, { transaction: t })
            )
        );

        await t.commit();

        res.status(201).json({
            message: "Costing created successfully",
            header: costingHeader,
            details: costingDetails,
        });
    } catch (error) {
        await t.rollback();
        console.error('Error creating costing:', error);
        res.status(500).json({ error: error.message });
    }
}


async function getAllCostings(req, res) {
    try {
        const costings = await CostingHeader.findAll({
            include: [CostingDetail],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(costings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getCostingById(req, res) {
    try {
        const { id } = req.params;
        const costing = await CostingHeader.findByPk(id, {
            include: [
                { model: CostingDetail }, // Include CostingDetails
                { model: Customer, as: 'customer' } // Include Customer details
            ]
        });

        if (costing) {
            res.status(200).json(costing);
        } else {
            res.status(404).json({ message: 'Costing not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateCosting(req, res) {
    const t = await sequelize.transaction();

    try {
        const { id } = req.params;
        const { headerData, detailsData } = req.body;

        const costingHeader = await CostingHeader.findByPk(id);
        if (!costingHeader) {
            await t.rollback();
            return res.status(404).json({ message: "Costing not found" });
        }

        // Update header
        await costingHeader.update(headerData, { transaction: t });

        // Delete existing details
        await CostingDetail.destroy({
            where: { costingHeaderId: id },
            transaction: t
        });

        // Create new details
        const newDetails = await Promise.all(
            detailsData.map(detail =>
                CostingDetail.create({
                    ...detail,
                    needImage: detail.needImage || false, // Use camelCase here
                    costingHeaderId: id
                }, { transaction: t })
            )
        );

        await t.commit();

        res.status(200).json({
            message: "Costing updated successfully",
            header: costingHeader,
            details: newDetails
        });
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
}

async function updateAllCosting(req, res) {
    const t = await sequelize.transaction();

    try {
        const { id } = req.params;
        const { headerData, detailsData } = req.body;

        const costingHeader = await CostingHeader.findByPk(id);
        if (!costingHeader) {
            await t.rollback();
            return res.status(404).json({ message: "Costing not found" });
        }

        await costingHeader.update({
            cusId: headerData.cusId,
            total_amount: headerData.totalAmount,
            total_profit: headerData.totalProfit,
            status: headerData.status || 'draft',
            preparedBy: headerData.preparedBy
        }, { transaction: t });

        await CostingDetail.destroy({
            where: { costing_header_id: id },
            transaction: t
        });

        const newDetails = await Promise.all(
            detailsData.map(detail =>
                CostingDetail.create({
                    costing_header_id: id, // Ensure correct field name
                    description_customer: detail.descriptionCustomer,
                    product_code: detail.productCode,
                    needImage: detail.needImage || false,
                    description: detail.description,
                    warranty: detail.warranty,
                    supplier: detail.supplier,
                    unit_cost: detail.unitCost,
                    our_margin_percentage: detail.ourMarginPercentage,
                    our_margin_value: detail.ourMarginValue,
                    other_margin_percentage: detail.otherMarginPercentage,
                    other_margin_value: detail.otherMarginValue,
                    price_plus_margin: detail.pricePlusMargin,
                    selling_rate: detail.sellingRate,
                    selling_rate_rounded: detail.sellingRateRounded,
                    uom: detail.uom,
                    qty: detail.qty,
                    unit_price: detail.unitPrice,
                    discount_percentage: detail.discountPercentage,
                    discount_value: detail.discountValue,
                    discounted_price: detail.discountedPrice,
                    amount: detail.amount,
                    profit: detail.profit,
                }, { transaction: t })
            )
        );

        await t.commit();

        res.status(200).json({
            message: "Costing updated successfully",
            header: costingHeader,
            details: newDetails
        });
    } catch (error) {
        await t.rollback();
        console.error('Error updating costing:', error);
        res.status(500).json({ error: error.message });
    }
}

async function deleteCosting(req, res) {
    const t = await sequelize.transaction();

    try {
        const { id } = req.params;

        // Check if the costing header exists
        const costingHeader = await CostingHeader.findByPk(id);
        if (!costingHeader) {
            await t.rollback();
            return res.status(404).json({ message: "Costing not found" });
        }

        // Delete associated details
        await CostingDetail.destroy({
            where: { costing_header_id: id },
            transaction: t
        });

        // Delete the costing header
        await costingHeader.destroy({ transaction: t });

        // Commit the transaction
        await t.commit();

        res.status(200).json({ message: "Costing deleted successfully" });
    } catch (error) {
        await t.rollback();
        console.error('Error deleting costing:', error);
        res.status(500).json({ error: error.message });
    }
}

async function updatePreparedBy(req, res) {
    try {
        const { id } = req.params;
        const { preparedBy } = req.body;

        const costingHeader = await CostingHeader.findByPk(id);
        if (!costingHeader) {
            return res.status(404).json({ message: "Costing not found" });
        }

        await costingHeader.update({ preparedBy });

        res.status(200).json({ message: "PreparedBy updated successfully", preparedBy });
    } catch (error) {
        console.error("Error updating preparedBy:", error);
        res.status(500).json({ error: error.message });
    }
}

async function updateCostingDetail(req, res) {
    const t = await sequelize.transaction();

    try {
        const { headerId, detailId } = req.params;
        const updateData = req.body;

        // First verify the header exists
        const header = await CostingHeader.findByPk(headerId);
        if (!header) {
            await t.rollback();
            return res.status(404).json({ message: "Costing header not found" });
        }

        // Find and update the detail
        const detail = await CostingDetail.findOne({
            where: {
                id: detailId,
                costing_header_id: headerId
            }
        });

        if (!detail) {
            await t.rollback();
            return res.status(404).json({ message: "Costing detail not found" });
        }

        // Transform camelCase to snake_case for database fields
        const transformedData = {
            description_customer: updateData.description_customer,
            product_code: updateData.product_code,
            description: updateData.description,
            warranty: updateData.warranty,
            supplier: updateData.supplier,
            unit_cost: updateData.unit_cost,
            our_margin_percentage: updateData.our_margin_percentage,
            our_margin_value: updateData.our_margin_value,
            other_margin_percentage: updateData.other_margin_percentage,
            other_margin_value: updateData.other_margin_value,
            price_plus_margin: updateData.price_plus_margin,
            selling_rate: updateData.selling_rate,
            selling_rate_rounded: updateData.selling_rate_rounded,
            uom: updateData.uom,
            qty: updateData.qty,
            unit_price: updateData.unit_price,
            discount_percentage: updateData.discount_percentage,
            discount_value: updateData.discount_value,
            discounted_price: updateData.discounted_price,
            amount: updateData.amount,
            profit: updateData.profit
        };

        await detail.update(transformedData, { transaction: t });

        // Recalculate header totals
        const updatedDetails = await CostingDetail.findAll({
            where: { costing_header_id: headerId },
            transaction: t
        });

        const totals = updatedDetails.reduce((acc, curr) => ({
            total_amount: acc.total_amount + Number(curr.amount),
            total_profit: acc.total_profit + Number(curr.profit)
        }), { total_amount: 0, total_profit: 0 });

        await header.update({
            total_amount: totals.total_amount,
            total_profit: totals.total_profit
        }, { transaction: t });

        await t.commit();

        res.status(200).json({
            message: "Costing detail updated successfully",
            detail: await detail.reload(),
            header: await header.reload()
        });
    } catch (error) {
        await t.rollback();
        console.error('Error updating costing detail:', error);
        res.status(500).json({ error: error.message });
    }
}

async function deleteCostingDetail(req, res) {
    const t = await sequelize.transaction();

    try {
        const { headerId, detailId } = req.params;

        // First verify the header exists
        const header = await CostingHeader.findByPk(headerId);
        if (!header) {
            await t.rollback();
            return res.status(404).json({ message: "Costing header not found" });
        }

        // Find and delete the detail
        const detail = await CostingDetail.findOne({
            where: {
                id: detailId,
                costing_header_id: headerId
            }
        });

        if (!detail) {
            await t.rollback();
            return res.status(404).json({ message: "Costing detail not found" });
        }

        await detail.destroy({ transaction: t });

        // Recalculate header totals after deletion
        const remainingDetails = await CostingDetail.findAll({
            where: { costing_header_id: headerId },
            transaction: t
        });

        const totals = remainingDetails.reduce((acc, curr) => ({
            total_amount: acc.total_amount + Number(curr.amount),
            total_profit: acc.total_profit + Number(curr.profit)
        }), { total_amount: 0, total_profit: 0 });

        await header.update({
            total_amount: totals.total_amount,
            total_profit: totals.total_profit
        }, { transaction: t });

        await t.commit();

        res.status(200).json({
            message: "Costing detail deleted successfully",
            header: await header.reload()
        });
    } catch (error) {
        await t.rollback();
        console.error('Error deleting costing detail:', error);
        res.status(500).json({ error: error.message });
    }
}

// module.exports = {
//     updatePreparedBy,
// };



module.exports = {
    createDraft,
    createCosting,
    getAllCostings,
    getCostingById,
    updateCosting,
    updateAllCosting,
    deleteCosting,
    updatePreparedBy,
    updateCostingDetail,
    deleteCostingDetail
};