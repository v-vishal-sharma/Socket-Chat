import React, { useContext, useState } from 'react'
import useLocalStorage from "../hooks/useLocalStorage"
import { useContacts } from './ContactsProvider'

const ConversationsContext = React.createContext()

//for using the Conversations
export function useConversations() {
  return useContext(ConversationsContext)
}

export function ConversationsProvider({ children }) {

  // will have the list of Conversations
  const [conversations, setConversations] = useLocalStorage('Conversations', [])
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0)
  const { contacts } = useContacts()

  // function to create a new Conversation
  function createConversation(recipients) {
    setConversations(prevConversations => {
      // appends the recieved id and name in the Conversations list
      return [...prevConversations, { recipients, message: [] }]
    })
  }

  const formattedConversations = conversations.map((conversation, index) => {
    const recipients = conversation.recipients.map(recipient => {
      const contact = contacts.find(contact => {
        return contact.id === recipient
      })
      // if contact exists then we'll get the name of contact else we'll the id which is recipient
      const name = (contact && contact.name) || recipient
      return { id: recipient, name }
    })
    const selected = index === selectedConversationIndex
    return { ...conversation, recipients, selected }
  })

  const value = {
    conversations: formattedConversations,
    //getting the selected conversation for later use for messaging
    selectedConversation: formattedConversations[selectedConversationIndex],
    selectConversationIndex: setSelectedConversationIndex,
    createConversation
  }

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>

  )
}
