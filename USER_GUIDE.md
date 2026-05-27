# GymFlow Staff POS - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Login](#login)
3. [Dashboard](#dashboard)
4. [Managing Shifts](#managing-shifts)
5. [Point of Sale (POS)](#point-of-sale-pos)
6. [Making Sales](#making-sales)
7. [Offline Mode](#offline-mode)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for initial setup
- Tablet or desktop device recommended for optimal experience

### First Time Setup
1. Open the application in your web browser
2. You'll be redirected to the login page
3. Enter your credentials provided by your manager
4. Once logged in, you can start using the POS system

---

## Login

![Login Page]

1. Navigate to the application URL
2. Enter your **Username**
3. Enter your **Password**
4. Click **Login**

**Demo Credentials (for testing):**
- Username: `staff`
- Password: `demo123`

**Note:** In offline mode, the app will remember your last login if you were previously authenticated.

---

## Dashboard

After logging in, you'll see the Dashboard page with:

### Current Status
- Your name and role
- Network status (Online/Offline)
- Last sync time

### Active Shift Information (if shift is started)
- Shift start time
- Starting cash amount
- Current sales count
- Total sales amount

### Available Actions
- **Start Shift** - Begin a new work shift
- **Open POS** - Access the Point of Sale interface (only when shift is active)
- **End Shift** - Close your current shift

---

## Managing Shifts

### Starting a Shift

1. From the Dashboard, locate the "Start Your Shift" section
2. Enter the **Starting Cash Amount** (default: $100.00)
3. Click **Start Shift**
4. Your shift is now active and saved locally

**Important Notes:**
- You must start a shift before making any sales
- Starting cash should match the amount in your cash drawer
- If offline, the shift will sync to the server when connection is restored

### Ending a Shift

1. From the Dashboard, review your shift statistics
2. Ensure all transactions are complete
3. Click **End Shift**
4. The system will calculate:
   - Total sales amount
   - Number of transactions
   - Expected cash in drawer

**What Happens:**
- Shift status changes to "closed"
- Final totals are calculated and saved
- Data syncs to server when online
- You can now start a new shift

---

## Point of Sale (POS)

### POS Interface Overview

The POS interface has two main sections:

#### Left Side - Products
- Product grid with images and details
- Search bar for finding products quickly
- Category filter dropdown
- Product cards showing:
  - Product name
  - Description
  - Price
  - Stock level
  - "Add to Cart" button

#### Right Side - Shopping Cart
- List of items in cart
- Quantity controls (+/- buttons)
- Subtotals for each item
- Payment method selector
- Total amount
- Checkout and Clear Cart buttons

### Searching for Products

1. Use the **Search bar** at the top to find products by name or description
2. Type your search term (e.g., "protein", "water bottle")
3. Products are filtered in real-time
4. Clear the search to show all products again

### Filtering by Category

1. Click the **Category dropdown**
2. Select a category (e.g., "Supplements", "Accessories", "Beverages")
3. Only products in that category will be displayed
4. Select "All Categories" to show everything

---

## Making Sales

### Step-by-Step Sale Process

#### 1. Add Items to Cart
- Browse or search for products
- Click **Add to Cart** on product cards
- Items appear in the cart on the right
- Default quantity is 1

#### 2. Adjust Quantities
- Use **+** button to increase quantity
- Use **-** button to decrease quantity
- Subtotal updates automatically
- Click **✕** to remove an item completely

#### 3. Select Payment Method
- Choose from three options:
  - **Cash** - Physical currency
  - **Card** - Credit/debit card
  - **Mobile** - Mobile payment (Apple Pay, Google Pay, etc.)
- Selected method will be highlighted

#### 4. Review Total
- Check the **Total Amount** displayed prominently
- Verify all items and quantities are correct
- If needed, click **Clear Cart** to start over

#### 5. Complete Checkout
- Click the **Checkout** button
- The sale is processed and saved locally
- A receipt window opens automatically
- Cart is cleared for the next customer

#### 6. Receipt
- Receipt displays in a new window/tab
- Contains:
  - Sale details and timestamp
  - Staff and shift information
  - Itemized list with prices
  - Total amount
  - Payment method
- Can be printed or saved as PDF
- Receipt is also stored in the system

### Quick Tips for Sales
- Double-check quantities before checkout
- Verify payment method selection
- Wait for "Sale completed successfully!" message
- Receipt can be reprinted from sale history (if needed)

---

## Offline Mode

### Understanding Offline Functionality

The POS system is designed to work **completely offline**. This ensures you can continue making sales even without internet connection.

### Features Available Offline
✅ Browse all products  
✅ Add items to cart  
✅ Complete sales  
✅ Print receipts  
✅ View shift information  
✅ Start/end shifts  

### Network Status Indicator

Located in the top-right corner:
- **Green dot** + "Online" = Connected to server
- **Red dot** + "Offline" = No connection
- "Syncing..." = Data is being synchronized
- "Last sync: HH:MM:SS" = Time of last successful sync

### How Offline Sync Works

1. **When You Go Offline:**
   - System automatically detects loss of connection
   - All new transactions are saved locally in IndexedDB
   - You can continue working normally

2. **Data Storage:**
   - Product catalog cached locally
   - All sales saved in local database
   - Shift information preserved
   - Sync queue created for pending uploads

3. **When You Come Back Online:**
   - System automatically detects connection
   - Starts syncing pending transactions
   - "Syncing..." indicator appears
   - Data sent to server in order received
   - Confirmation when sync complete

4. **Manual Sync:**
   - Refresh the page to trigger a sync check
   - System will attempt to sync any pending data

### Offline Best Practices

- ✓ Ensure you have synced recently before going offline
- ✓ Products should be loaded before losing connection
- ✓ Keep browser tab open to maintain local data
- ✓ Don't clear browser data while offline with pending transactions
- ✓ Connect to internet regularly to sync data
- ✓ Verify "Last sync" time periodically

---

## Troubleshooting

### Login Issues

**Problem:** Cannot log in  
**Solutions:**
- Verify username and password are correct
- Check if you have internet connection (required for first login)
- Try refreshing the page
- Contact your manager for credential reset

---

**Problem:** "Login failed" error  
**Solutions:**
- Ensure server is running and accessible
- Check network connection
- Wait a moment and try again
- Contact IT support if issue persists

---

### Shift Issues

**Problem:** Cannot start shift  
**Solutions:**
- Make sure you don't have an active shift already
- Try refreshing the page
- Log out and log back in
- Check if previous shift was properly closed

---

**Problem:** Shift not syncing  
**Solutions:**
- Wait for internet connection to restore
- Check network status indicator
- Refresh page to trigger sync
- Shift will sync automatically when online

---

### Cart and Checkout Issues

**Problem:** Cannot add item to cart  
**Solutions:**
- Check if product is in stock
- Try refreshing the page
- Check if shift is active
- Clear browser cache if issue persists

---

**Problem:** Checkout button not working  
**Solutions:**
- Ensure cart has items
- Verify shift is active
- Check that payment method is selected
- Try refreshing the page

---

**Problem:** Receipt not printing  
**Solutions:**
- Check browser popup blocker settings
- Allow popups for this site
- Try using Ctrl+P (Cmd+P on Mac) in receipt window
- Save as PDF if printing fails

---

### Sync Issues

**Problem:** "Syncing..." stays forever  
**Solutions:**
- Check internet connection
- Wait 2-3 minutes for timeout
- Refresh the page
- Check if server is accessible

---

**Problem:** Sales not appearing on server  
**Solutions:**
- Verify you're online
- Check "Last sync" time
- Refresh page to trigger sync
- Sales will queue and sync when connection restored

---

### Performance Issues

**Problem:** App running slowly  
**Solutions:**
- Close other browser tabs
- Clear browser cache
- Restart browser
- Check device memory/resources

---

**Problem:** Products not loading  
**Solutions:**
- Refresh the page
- Check internet connection (for first load)
- Clear browser data
- Wait for sync to complete

---

### Browser Issues

**Problem:** App not working properly  
**Solutions:**
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Update your browser to latest version
- Clear browser cache and cookies
- Try a different browser

---

## Getting Help

If you encounter issues not covered in this guide:

1. **Check with your supervisor** - They may have quick solutions
2. **Contact IT Support** - Provide details about the issue
3. **Include in your report:**
   - What you were trying to do
   - Error messages (take a screenshot)
   - Whether you're online or offline
   - Browser and device information

---

## Tips for Efficient Use

### Speed Tips
- Use search bar for quick product lookup
- Learn product categories for faster browsing
- Keep frequently sold items in mind
- Use keyboard shortcuts when available (future feature)

### Accuracy Tips
- Always verify quantities before checkout
- Double-check totals
- Ensure correct payment method selected
- Print receipt for customer records

### Reliability Tips
- Sync regularly when online
- Don't close browser with pending transactions
- Start shift at beginning of work period
- End shift when closing out

---

## Frequently Asked Questions

**Q: What happens if my device loses power during a sale?**  
A: The sale in progress will be lost, but all completed sales are saved locally and safe.

**Q: Can multiple staff use the same device?**  
A: Yes, but each person must log in with their own credentials and manage their own shifts.

**Q: How long can I work offline?**  
A: Indefinitely for sales operations. Sync when you can to send data to the server.

**Q: What if there's a discrepancy between my shift and actual cash?**  
A: Report to your supervisor immediately. Review sales history and receipts.

**Q: Can I void or refund a sale?**  
A: This feature may be available - check with your manager or IT team.

**Q: What if a product is out of stock?**  
A: The "Add to Cart" button will be disabled and show "Out of Stock". Notify management to restock.

---

**Version:** 1.0  
**Last Updated:** February 2026  
**For Support:** Contact your system administrator
