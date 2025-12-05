// Christian Martinez
function validateCommentInput(data) {
    const errors = {};

    const userId = data.userId?.trim();
    const userName = data.userName?.trim();
    const eventId = data.eventId?.trim();
    const content = data.content?.trim();

    // userId
    if (!userId) {
        errors.userId = 'User ID is required.';
    }

    // userName
    if (!userName) {
        errors.userName = 'User name is required.';
    }

    // eventId
    if (!eventId) {
        errors.eventId = 'Event ID is required.';
    }

    // content
    if (!content) {
        errors.content = 'Content is required.';
    } else if (content.length < 3) {
        errors.content = 'Content must be at least 3 characters long.';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

module.exports = validateCommentInput;
