class ImagePostDTO {
  constructor({
    imageUrl,
    caption,
    selectedPlatform = null,
    selectedAccountId = null,
    draftId = null,
  }) {
    this.imageUrl = imageUrl;
    this.caption = caption;
    this.selectedPlatform = selectedPlatform;
    this.selectedAccountId = selectedAccountId;
    this.draftId = draftId;
  }

  // Payload for instant LinkedIn post
  toLinkedInPayload() {
    return {
      content: this.caption,
      imageUrl: this.imageUrl,
      linkedinAccountId: this.selectedAccountId,
    };
  }

  // Payload for saving draft
  toDraftPayload() {
    return {
      content: this.caption,
      imageUrl: this.imageUrl,
      draftId: this.draftId,
    };
  }

  // Payload for scheduling a LinkedIn post
  toLinkedInSchedulePayload(scheduleDate) {
    return {
      content: this.caption,
      imageUrl: this.imageUrl,
      scheduledTime: scheduleDate,
      linkedinAccountId: this.selectedAccountId,
    };
  }

  // Payload for scheduling a Facebook Page post
  toFacebookSchedulePayload(scheduleDate, pageId) {
    return {
      content: this.caption,
      imageUrl: this.imageUrl,
      scheduledTime: scheduleDate,
      pageId: pageId,
      facebookAccountId: this.selectedAccountId,
    };
  }

}

export default ImagePostDTO;
