import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function convertToReadableDate(isoDate: string) {
  const date = new Date(isoDate);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}
export function getRelativeTime(createdAt: string) {
  const now = new Date();
  const pastDate = new Date(createdAt);
  const diffInMs = now.getTime() - pastDate.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hr ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  }
}

// Check if URL points to an image based on extension
export const isImageUrl = (url: string): boolean => {
  if (!url) {
    return false;
  }
  const imageExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.svg',
    '.bmp',
    '.tiff',
  ];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some((ext) => lowerUrl.endsWith(ext));
};

// Check if URL points to a document based on extension
export const isDocumentUrl = (url: string): boolean => {
  if (!url) {
    return false;
  }
  const docExtensions = [
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.txt',
    '.rtf',
  ];
  const lowerUrl = url.toLowerCase();
  return docExtensions.some((ext) => lowerUrl.endsWith(ext));
};

// Pixel GIF code adapted from https://stackoverflow.com/a/33919020/266535
const keyStr =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

export const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

export const __sample_markdown = `Of course! Here is a long, non-technical Markdown document perfect for testing the styling of a new editor, with no code or technical jargon.

# A Guide to Planning the Perfect Weekend Getaway

This document tests various styles for a clean, readable editor. Let's imagine we're writing a fun travel article!

## Why You Need a Break

In our busy lives, it's easy to get caught up in the daily grind. A short weekend trip isn't just a luxury; it's a chance to **recharge your batteries**, **create lasting memories**, and **break the routine** without using too much vacation time.

This guide will help you plan a seamless and enjoyable escape.

---

## Choosing Your Destination

The first step is picking where to go. Your choice sets the tone for the entire weekend.

### Consider Your Interests
*   **For the Nature Lover:** Look for destinations with hiking trails, lakes, or scenic parks.
*   **For the Foodie:** Choose a town known for its local restaurants, farmers markets, or wineries.
*   **For the History Buff:** Explore a city with rich museums, historical tours, and architecture.

### Practical Factors
*   **Drive Time:** A destination within a 2-3 hour drive often feels like a true escape without the travel fatigue.
*   **Budget:** Be realistic about costs for accommodation, food, and activities.
*   **Group Preferences:** Are you traveling solo, as a couple, or with family? Make sure the destination has something for everyone.

---

## Creating a Simple Itinerary

A little planning prevents you from wasting precious time figuring out what to do next.

### A Sample Schedule

**Friday Evening**
*   Leave work, hit the road!
*   Check into your accommodation.
*   Find a cozy local spot for a relaxed dinner. No cooking tonight!

**Saturday**
*   **Morning:** Enjoy a leisurely breakfast. Then, head out for your main activity—perhaps a museum visit or a nature walk.
*   **Afternoon:** Grab lunch at a highly-recommended cafe. Explore the local shops or simply find a beautiful spot to people-watch.
*   **Evening:** Dress up a little for a nice dinner. Maybe see if there's any local live music happening.

**Sunday**
*   **Morning:** One last delicious breakfast. Do one final thing you wanted to do—buy a souvenir, take a few more photos, or enjoy a final stroll.
*   **Afternoon:** Check out and begin your journey home, feeling refreshed.

> **Pro Tip:** The goal is balance. Don't overschedule! Leave plenty of room for spontaneous discoveries and simple relaxation. The best moments are often the unplanned ones.

---

## Essential Packing List

Packing light is key for a short trip. Here’s a simple checklist:

| Category | Items |
| :--- | :--- |
| **Clothing** | Comfortable shoes, outfits for day and night, a jacket |
| **Toiletries** | Toothbrush, toothpaste, any daily essentials |
| **Important Items** | Wallet, ID, phone, charger, any necessary medications |
| **Extras** | A good book, headphones, a reusable water bottle |

---

## Making the Most of Your Trip

Finally, remember the point of it all: to enjoy yourself.

*   **Be Present:** Try to put your phone away during meals and activities. Really talk to your travel companions.
*   **Try Something New:** Order a dish you've never heard of. Talk to a local and ask for their recommendation.
*   **Don't Stress the Small Stuff:** Got a flat tire? Raining on your hike? Sometimes the mishaps make for the best stories later.

A successful weekend getaway leaves you feeling happier and more connected than you were before you left.

---

### Final Thoughts

You don't need to cross an ocean to have an adventure. A well-planned weekend escape can feel just as exciting and rewarding as a longer vacation. So, what are you waiting for? Start dreaming and planning your next mini-adventure today!

> "We travel not to escape life, but for life not to escape us." – Anonymous

***

I hope this guide was helpful! Feel free to refer back to it whenever you need a little inspiration for a break.`;
