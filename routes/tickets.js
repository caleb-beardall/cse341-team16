// Percy Yarleque - Ticket Validation Routes

const router = require("express").Router();
const tickets = require("../controllers/tickets");
const {
    myTicketsValidator,
    getTicketDetailsValidator,
    updateNominatedHolderValidator,
    getAllTicketsValidator,
    cancelTicketValidator,
    validateTicketForEntryValidator,
} = require("../helpers/validateTicket");

router.get("/my-tickets/:userId", myTicketsValidator, tickets.myTickets);
router.get("/:ticketId/:userId", getTicketDetailsValidator, tickets.getTicketDetails);
router.put("/:ticketId/nominated-holder", updateNominatedHolderValidator, tickets.updateNominatedHolder);
router.get("/", getAllTicketsValidator, tickets.getAllTickets);
router.post("/:id/cancel", cancelTicketValidator, tickets.cancelTicket);
router.post("/validate-entry", validateTicketForEntryValidator, tickets.validateTicketForEntry);

module.exports = router;