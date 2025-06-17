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

  toLinkedInSchedulePayload(scheduleDate, linkedinAccountIds) {
    return {
      content: this.caption,
      imageUrl: this.imageUrl,
      scheduledTime: scheduleDate,
      linkedinAccountIds,
    }
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
toInstagramPayload() {
  return {
    instagramAccountId: this.selectedAccountId,
    imageUrl: this.imageUrl,
    caption: this.caption,
  };
}
 
toInstagramSchedulePayload(scheduleDate, instagramAccountIds) {
    return {
      imageUrl: this.imageUrl,
      caption: this.caption,
      scheduledTime: scheduleDate,
      instagramAccountIds,
    };
  }
  toXSchedulePayload(scheduleDate, xAccountIds) {
    return {
      imageUrl: this.imageUrl,
      caption: this.caption,
      scheduledTime: scheduleDate,
      xAccountIds,
    }
  }
  
toXPayload() {
  return {
    xAccountId: this.selectedAccountId,
    imageUrl: this.imageUrl,
    caption: this.caption,
  };
}
}

export default ImagePostDTO;
