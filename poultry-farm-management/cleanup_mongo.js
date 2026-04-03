use('poultry-farm');

// Find the user first
const user = db.users.findOne({ email: 'test@example.com' });

if (!user) {
    console.log('❌ User test@example.com not found.');
} else {
    console.log(`✅ User found: ${user._id} (${user.name})`);
    
    // Count alerts before deletion
    const count = db.notifications.countDocuments({ user: user._id });
    console.log(`🔍 Found ${count} total notifications for this user.`);
    
    // Remove all notifications as requested (pending alerts)
    const result = db.notifications.deleteMany({ user: user._id });
    console.log(`✅ Successfully removed ${result.deletedCount} notifications.`);
}
