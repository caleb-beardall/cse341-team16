// Percy Yarleque - Ticket Validation Routes

const router = require("express").Router();
const tickets = require("../controllers/tickets");
const { ensureAuth } = require('../middleware/auth');
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
router.put("/:ticketId/nominated-holder", ensureAuth, updateNominatedHolderValidator, tickets.updateNominatedHolder);
router.get("/", ensureAuth, getAllTicketsValidator, tickets.getAllTickets);
router.post("/:id/cancel", ensureAuth, cancelTicketValidator, tickets.cancelTicket);
router.post("/validate-entry", ensureAuth, validateTicketForEntryValidator, tickets.validateTicketForEntry);

module.exports = router;