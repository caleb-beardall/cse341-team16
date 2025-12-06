// Caleb Beardall
const ALLOWED_STATUSES = ['Going', 'Not Going', 'Undecided'];

function validateRsvpInput(data) {
    const errors = {};

    const userId = data.userId?.trim();
    const eventId = data.eventId?.trim();
    const status = data.status?.trim();

    // userId
    if (!userId) {
        errors.userId = 'User ID is required.';
    }

    // eventId
    if (!eventId) {
        errors.eventId = 'Event ID is required.';
    }

    // status
    if (!status) {
        errors.status = 'RSVP status is required.';
    } else if (!ALLOWED_STATUSES.includes(status)) {
        errors.status = `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

module.exports = validateRsvpInput;