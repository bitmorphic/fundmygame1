import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, Search, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Contact {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  lastMessage?: string;
  lastTime?: string;
  unread?: number;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean | null;
}

const MessagesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading]);

  // Load contacts (users who have exchanged messages with current user)
  useEffect(() => {
    if (!user) return;
    const loadContacts = async () => {
      // Get all unique user IDs from messages
      const { data: msgs } = await supabase
        .from("messages")
        .select("sender_id, receiver_id, content, created_at")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (!msgs) return;

      const contactIds = new Set<string>();
      const lastMsgMap: Record<string, { content: string; time: string }> = {};

      msgs.forEach((m) => {
        const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
        contactIds.add(otherId);
        if (!lastMsgMap[otherId]) {
          lastMsgMap[otherId] = { content: m.content, time: m.created_at };
        }
      });

      if (contactIds.size === 0) {
        // Load all users as potential contacts
        const { data: allProfiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url")
          .neq("user_id", user.id)
          .limit(20);
        if (allProfiles) setContacts(allProfiles.map(p => ({ ...p, avatar_url: p.avatar_url })));
        return;
      }

      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", Array.from(contactIds));

      if (profiles) {
        setContacts(
          profiles.map((p) => ({
            ...p,
            lastMessage: lastMsgMap[p.user_id]?.content,
            lastTime: lastMsgMap[p.user_id]?.time,
          }))
        );
      }
    };
    loadContacts();
  }, [user]);

  // Load messages for selected contact
  useEffect(() => {
    if (!user || !selectedContact) return;
    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${selectedContact.user_id}),and(sender_id.eq.${selectedContact.user_id},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    };
    loadMessages();

    // Mark unread messages as read
    supabase
      .from("messages")
      .update({ read: true })
      .eq("sender_id", selectedContact.user_id)
      .eq("receiver_id", user.id)
      .eq("read", false)
      .then();
  }, [user, selectedContact]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as Message;
          if (
            (msg.sender_id === user.id || msg.receiver_id === user.id) &&
            selectedContact &&
            (msg.sender_id === selectedContact.user_id || msg.receiver_id === selectedContact.user_id)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedContact]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !selectedContact || sending) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedContact.user_id,
      content: newMessage.trim(),
    });
    if (error) toast.error("Failed to send message");
    else setNewMessage("");
    setSending(false);
  };

  const filteredContacts = contacts.filter((c) =>
    c.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Chat with athletes and sponsors in real-time</p>
        </motion.div>

        <div className="glass-card overflow-hidden grid md:grid-cols-[300px_1fr] h-[65vh]">
          {/* Contact list */}
          <div className="border-r border-border flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border h-9 text-sm"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {filteredContacts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No contacts yet</p>
              )}
              {filteredContacts.map((contact) => (
                <button
                  key={contact.user_id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full flex items-center gap-3 p-3 text-left hover:bg-secondary/50 transition-colors border-b border-border/50 ${
                    selectedContact?.user_id === contact.user_id ? "bg-secondary/70" : ""
                  }`}
                >
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                      {contact.full_name?.charAt(0) || "?"}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{contact.full_name || "Unknown"}</p>
                    {contact.lastMessage && (
                      <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                    )}
                  </div>
                </button>
              ))}
            </ScrollArea>
          </div>

          {/* Chat area */}
          <div className="flex flex-col">
            {selectedContact ? (
              <>
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                    {selectedContact.full_name?.charAt(0) || "?"}
                  </div>
                  <p className="font-medium text-foreground">{selectedContact.full_name}</p>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                            msg.sender_id === user?.id
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-secondary text-foreground rounded-bl-md"
                          }`}
                        >
                          {msg.content}
                          <p className={`text-[10px] mt-1 ${msg.sender_id === user?.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>
                <div className="p-3 border-t border-border flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="bg-secondary/50 border-border"
                  />
                  <Button onClick={handleSend} disabled={sending || !newMessage.trim()} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Select a contact to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MessagesPage;
