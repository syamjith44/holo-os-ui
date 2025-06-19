import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Video, Share, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Contact } from "@shared/schema";

export default function CommunicationsWindow() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ['/api/contacts'],
    queryFn: async () => {
      const response = await fetch('/api/contacts?userId=1', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      return response.json();
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-holo-accent';
      case 'away':
        return 'bg-holo-accent opacity-60';
      case 'busy':
        return 'bg-holo-accent opacity-40';
      default:
        return 'border border-holo-border';
    }
  };

  const handleVoiceCall = (contact: Contact) => {
    // Simulate voice call
    console.log(`Initiating voice call with ${contact.name}`);
    alert(`Voice call initiated with ${contact.name}`);
  };

  const handleVideoCall = (contact: Contact) => {
    // Simulate video call
    console.log(`Initiating video call with ${contact.name}`);
    alert(`Video call initiated with ${contact.name}`);
  };

  const handleScreenShare = () => {
    // Simulate screen sharing
    console.log('Initiating screen share');
    alert('Screen sharing initiated');
  };

  const handleMessage = (contact: Contact) => {
    // Simulate messaging
    console.log(`Opening chat with ${contact.name}`);
    alert(`Opening chat with ${contact.name}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm opacity-60">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Contact List */}
      <div className="flex-1 p-4">
        <div className="text-xs opacity-60 mb-3 uppercase tracking-wide">
          Active Connections ({contacts.length})
        </div>
        <div className="space-y-2 holo-scrollbar overflow-y-auto max-h-64">
          {contacts.length === 0 ? (
            <div className="text-center text-sm opacity-60 py-4">
              No contacts available
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center space-x-3 p-2 border border-holo-border rounded hover:bg-holo-surface cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id ? 'bg-holo-surface' : ''
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="w-8 h-8 border border-holo-accent rounded flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {contact.avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{contact.name}</div>
                  <div className="text-xs opacity-60 capitalize">{contact.status}</div>
                </div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(contact.status)}`} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Communication Controls */}
      <div className="p-4 border-t border-holo-border space-y-2">
        {selectedContact ? (
          <>
            <div className="text-xs opacity-60 mb-2">
              Selected: {selectedContact.name} ({selectedContact.status})
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleVoiceCall(selectedContact)}
                className="flex-1 holo-button-primary flex items-center justify-center space-x-1"
              >
                <Phone className="w-3 h-3" />
                <span>VOICE</span>
              </Button>
              <Button
                onClick={() => handleVideoCall(selectedContact)}
                className="flex-1 holo-button flex items-center justify-center space-x-1"
              >
                <Video className="w-3 h-3" />
                <span>VIDEO</span>
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleMessage(selectedContact)}
                className="flex-1 holo-button flex items-center justify-center space-x-1"
              >
                <MessageCircle className="w-3 h-3" />
                <span>MESSAGE</span>
              </Button>
              <Button
                onClick={handleScreenShare}
                className="flex-1 holo-button flex items-center justify-center space-x-1"
              >
                <Share className="w-3 h-3" />
                <span>SHARE</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-xs opacity-60 py-4">
            Select a contact to start communication
          </div>
        )}
      </div>
    </div>
  );
}
