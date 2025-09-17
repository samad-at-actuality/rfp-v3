import { TOtherInfo } from '@/types/TFolderInfo';
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

export const copyToClipBoard = (content: string, cb?: () => void) => {
  if (typeof window !== 'undefined' && window.navigator.clipboard) {
    navigator.clipboard.writeText(content).then(() => {
      cb?.();
    });
  }
};
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
export const __sample_html = `<p>Of course! Here is a long, non-technical Markdown document perfect for testing the styling of a new editor, with no code or technical jargon.</p>
<h1 id="a-guide-to-planning-the-perfect-weekend-getaway">A Guide to Planning the Perfect Weekend Getaway</h1>
<p>This document tests various styles for a clean, readable editor. Let's imagine we're writing a fun travel article!</p>
<h2 id="why-you-need-a-break">Why You Need a Break</h2>
<p>In our busy lives, it's easy to get caught up in the daily grind. A short weekend trip isn't just a luxury; it's a chance to <strong>recharge your batteries</strong>, <strong>create lasting memories</strong>, and <strong>break the routine</strong> without using too much vacation time.</p>
<p>This guide will help you plan a seamless and enjoyable escape.</p>
<hr>
<h2 id="choosing-your-destination">Choosing Your Destination</h2>
<p>The first step is picking where to go. Your choice sets the tone for the entire weekend.</p>
<h3 id="consider-your-interests">Consider Your Interests</h3>
<ul>
<li><strong>For the Nature Lover:</strong> Look for destinations with hiking trails, lakes, or scenic parks.</li>
<li><strong>For the Foodie:</strong> Choose a town known for its local restaurants, farmers markets, or wineries.</li>
<li><strong>For the History Buff:</strong> Explore a city with rich museums, historical tours, and architecture.</li>
</ul>
<h3 id="practical-factors">Practical Factors</h3>
<ul>
<li><strong>Drive Time:</strong> A destination within a 2-3 hour drive often feels like a true escape without the travel fatigue.</li>
<li><strong>Budget:</strong> Be realistic about costs for accommodation, food, and activities.</li>
<li><strong>Group Preferences:</strong> Are you traveling solo, as a couple, or with family? Make sure the destination has something for everyone.</li>
</ul>
<hr>
<h2 id="creating-a-simple-itinerary">Creating a Simple Itinerary</h2>
<p>A little planning prevents you from wasting precious time figuring out what to do next.</p>
<h3 id="a-sample-schedule">A Sample Schedule</h3>
<p><strong>Friday Evening</strong></p>
<ul>
<li>Leave work, hit the road!</li>
<li>Check into your accommodation.</li>
<li>Find a cozy local spot for a relaxed dinner. No cooking tonight!</li>
</ul>
<p><strong>Saturday</strong></p>
<ul>
<li><strong>Morning:</strong> Enjoy a leisurely breakfast. Then, head out for your main activity—perhaps a museum visit or a nature walk.</li>
<li><strong>Afternoon:</strong> Grab lunch at a highly-recommended cafe. Explore the local shops or simply find a beautiful spot to people-watch.</li>
<li><strong>Evening:</strong> Dress up a little for a nice dinner. Maybe see if there's any local live music happening.</li>
</ul>
<p><strong>Sunday</strong></p>
<ul>
<li><strong>Morning:</strong> One last delicious breakfast. Do one final thing you wanted to do—buy a souvenir, take a few more photos, or enjoy a final stroll.</li>
<li><strong>Afternoon:</strong> Check out and begin your journey home, feeling refreshed.</li>
</ul>
<blockquote>
<p><strong>Pro Tip:</strong> The goal is balance. Don't overschedule! Leave plenty of room for spontaneous discoveries and simple relaxation. The best moments are often the unplanned ones.</p>
</blockquote>
<hr>
<h2 id="essential-packing-list">Essential Packing List</h2>
<p>Packing light is key for a short trip. Here’s a simple checklist:</p>
<table>
<thead>
<tr>
<th>Category</th>
<th>Items</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Clothing</strong></td>
<td>Comfortable shoes, outfits for day and night, a jacket</td>
</tr>
<tr>
<td><strong>Toiletries</strong></td>
<td>Toothbrush, toothpaste, any daily essentials</td>
</tr>
<tr>
<td><strong>Important Items</strong></td>
<td>Wallet, ID, phone, charger, any necessary medications</td>
</tr>
<tr>
<td><strong>Extras</strong></td>
<td>A good book, headphones, a reusable water bottle</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="making-the-most-of-your-trip">Making the Most of Your Trip</h2>
<p>Finally, remember the point of it all: to enjoy yourself.</p>
<ul>
<li><strong>Be Present:</strong> Try to put your phone away during meals and activities. Really talk to your travel companions.</li>
<li><strong>Try Something New:</strong> Order a dish you've never heard of. Talk to a local and ask for their recommendation.</li>
<li><strong>Don't Stress the Small Stuff:</strong> Got a flat tire? Raining on your hike? Sometimes the mishaps make for the best stories later.</li>
</ul>
<p>A successful weekend getaway leaves you feeling happier and more connected than you were before you left.</p>
<hr>
<h3 id="final-thoughts">Final Thoughts</h3>
<p>You don't need to cross an ocean to have an adventure. A well-planned weekend escape can feel just as exciting and rewarding as a longer vacation. So, what are you waiting for? Start dreaming and planning your next mini-adventure today!</p>
<blockquote>
<p>"We travel not to escape life, but for life not to escape us." – Anonymous</p>
</blockquote>
<hr>
<p>I hope this guide was helpful! Feel free to refer back to it whenever you need a little inspiration for a break.</p>
`;
export const extToMime = (ext: string) => {
  const mappings: { [key: string]: string } = {
    png: 'image/png',
    jpg: 'image/jpeg',
    gif: 'image/gif',
    pdf: 'application/pdf',
    txt: 'text/plain',
    json: 'application/json',
    zip: 'application/zip',
    mp4: 'video/mp4',
  };
  return mappings[ext] ?? 'application/octet-stream'; // Default to binary
};
export const otherInfoToMDTable = (data: TOtherInfo[]) => {
  // table header
  let md = `| Key | Value |\n|-----|-------|\n`;

  data.forEach((item) => {
    // replace newlines in value with <br> for Markdown formatting
    const value = item.value.replace(/\n/g, '<br>');
    md += `| ${item.key} | ${value} |\n`;
  });

  return md;
};

export function extractFileNameFromKey(fileKey: string) {
  const fileNameWithUUID = fileKey.split('/').pop();
  return fileNameWithUUID?.replace(/^[0-9a-f-]{32,36}-/, '') || '';
}

export const convertBytesToMBOrKB = (bytes: number): string => {
  if (!bytes || bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(2);

  // Remove trailing .00 if it exists
  const formattedSize = size.endsWith('.00')
    ? size.slice(0, -3)
    : size.endsWith('0')
      ? size.slice(0, -1)
      : size;

  return `${formattedSize} ${units[i]}`;
};
export const formattedTimestamp = (date: string) => {
  const timestamp = new Date(date);

  const formatted = timestamp.toLocaleString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return formatted;
};
