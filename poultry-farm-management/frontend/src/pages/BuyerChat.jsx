export default function BuyerChat() {
  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] bg-white rounded-xl overflow-hidden border border-gray-200 items-center justify-center text-center p-8">
      <div className="bg-brand-50 p-6 rounded-full mb-6">
        <svg className="w-16 h-16 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Direct Messaging</h2>
      <p className="text-gray-500 max-w-md">Connect directly with farmers to negotiate prices, ask about poultry conditions, or track your orders.</p>
      
      <div className="mt-8 px-6 py-3 bg-gray-100 text-gray-600 font-medium rounded-full text-sm">
        This feature is currently simulated and will be launched in Phase 2.
      </div>
    </div>
  );
}
