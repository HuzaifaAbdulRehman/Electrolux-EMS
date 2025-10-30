/**
 * BROWSER NOTIFICATION TEST SCRIPT
 * Copy and paste this into your browser console (F12) to test notifications
 */

console.log('🧪 Starting Notification System Browser Test...\n');

// Test function
async function testNotifications() {
  try {
    // Test 1: Check if we're logged in
    console.log('📋 Test 1: Checking authentication...');
    const sessionResponse = await fetch('/api/auth/session');
    const session = await sessionResponse.json();
    
    if (session.user) {
      console.log(`✅ Logged in as: ${session.user.userType} (${session.user.email})`);
    } else {
      console.log('❌ Not logged in - please login first');
      return;
    }
    
    // Test 2: Test notifications API
    console.log('\n📋 Test 2: Testing notifications API...');
    const notificationsResponse = await fetch('/api/notifications');
    const notificationsData = await notificationsResponse.json();
    
    if (notificationsResponse.ok) {
      console.log('✅ Notifications API working');
      console.log(`📊 Found ${notificationsData.data?.length || 0} notifications`);
      
      if (notificationsData.data && notificationsData.data.length > 0) {
        console.log('📝 Recent notifications:');
        notificationsData.data.slice(0, 3).forEach((notif, index) => {
          console.log(`   ${index + 1}. ${notif.title} (${notif.type}) - ${notif.read ? 'Read' : 'Unread'}`);
        });
      }
    } else {
      console.log('❌ Notifications API failed:', notificationsData.error);
    }
    
    // Test 3: Test specific user type API
    console.log('\n📋 Test 3: Testing user-specific API...');
    let userApiUrl = '/api/notifications';
    if (session.user.userType === 'employee') {
      userApiUrl = '/api/employee/notifications';
    }
    
    const userResponse = await fetch(userApiUrl);
    const userData = await userResponse.json();
    
    if (userResponse.ok) {
      console.log(`✅ ${session.user.userType} notifications API working`);
      console.log(`📊 Found ${userData.data?.length || 0} notifications`);
    } else {
      console.log(`❌ ${session.user.userType} notifications API failed:`, userData.error);
    }
    
    // Test 4: Test notification actions
    console.log('\n📋 Test 4: Testing notification actions...');
    if (notificationsData.data && notificationsData.data.length > 0) {
      const firstNotification = notificationsData.data[0];
      
      // Test mark as read
      if (!firstNotification.read) {
        console.log('🔄 Testing mark as read...');
        const markReadResponse = await fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: firstNotification.id })
        });
        
        if (markReadResponse.ok) {
          console.log('✅ Mark as read working');
        } else {
          console.log('❌ Mark as read failed');
        }
      }
    }
    
    // Test 5: Check notification page elements
    console.log('\n📋 Test 5: Checking notification page elements...');
    const elements = {
      'Header': document.querySelector('h1'),
      'Filter buttons': document.querySelectorAll('button[class*="bg-"]'),
      'Notification cards': document.querySelectorAll('[class*="backdrop-blur"]'),
      'Mark all read button': document.querySelector('button:has-text("Mark All Read")') || 
                            document.querySelector('button[class*="green"]'),
      'Refresh button': document.querySelector('button[class*="refresh"]') ||
                       document.querySelector('button:has-text("Refresh")')
    };
    
    Object.entries(elements).forEach(([name, element]) => {
      if (element) {
        console.log(`✅ ${name}: Found`);
      } else {
        console.log(`❌ ${name}: Not found`);
      }
    });
    
    // Summary
    console.log('\n🎉 BROWSER TEST COMPLETE!\n');
    console.log('📋 SUMMARY:');
    console.log(`✅ Authentication: ${session.user ? 'Working' : 'Failed'}`);
    console.log(`✅ Notifications API: ${notificationsResponse.ok ? 'Working' : 'Failed'}`);
    console.log(`✅ User-specific API: ${userResponse.ok ? 'Working' : 'Failed'}`);
    console.log(`✅ Page elements: ${Object.values(elements).some(el => el) ? 'Found' : 'Missing'}\n`);
    
    console.log('🚀 NEXT STEPS:');
    console.log('1. Test with other user types (Admin, Employee)');
    console.log('2. Test notification creation workflow');
    console.log('3. Test filtering and actions');
    console.log('4. Check for console errors during normal usage\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Make sure you are on the notifications page');
    console.log('2. Check if the server is running (npm run dev)');
    console.log('3. Check browser console for other errors');
    console.log('4. Try refreshing the page');
  }
}

// Run the test
testNotifications();

// Also provide a quick manual test function
window.testNotificationActions = async function() {
  console.log('🧪 Testing notification actions manually...\n');
  
  // Test mark all as read
  const markAllButton = document.querySelector('button:has-text("Mark All Read")') || 
                       document.querySelector('button[class*="green"]');
  if (markAllButton) {
    console.log('🔄 Clicking "Mark All Read" button...');
    markAllButton.click();
    console.log('✅ Button clicked');
  }
  
  // Test refresh
  const refreshButton = document.querySelector('button[class*="refresh"]') ||
                       document.querySelector('button:has-text("Refresh")');
  if (refreshButton) {
    console.log('🔄 Clicking refresh button...');
    refreshButton.click();
    console.log('✅ Button clicked');
  }
  
  // Test filters
  const filterButtons = document.querySelectorAll('button[class*="bg-"]');
  if (filterButtons.length > 0) {
    console.log('🔄 Testing filter buttons...');
    filterButtons.forEach((btn, index) => {
      if (index < 3) { // Test first 3 filters
        console.log(`   Testing filter ${index + 1}...`);
        btn.click();
        setTimeout(() => {
          console.log(`   ✅ Filter ${index + 1} clicked`);
        }, 100);
      }
    });
  }
  
  console.log('\n✅ Manual action tests completed!');
};

console.log('\n💡 TIP: You can also run testNotificationActions() to test UI interactions');

