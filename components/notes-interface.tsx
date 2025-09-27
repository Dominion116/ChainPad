"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, FileText, Hash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Wallet } from "lucide-react" // Import Wallet component
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants"

interface NotesInterfaceProps {
  account: string | null
}

export function NotesInterface({ account }: NotesInterfaceProps) {
  const [notes, setNotes] = useState<string[]>([])
  const [notesCount, setNotesCount] = useState<number>(0)
  const [newNote, setNewNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (account) {
      loadNotes()
      loadNotesCount()
    }
  }, [account])

  const getContract = () => {
    if (!window.ethereum) return null

    const Web3 = require("web3")
    const web3 = new Web3(window.ethereum)
    return new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS)
  }

  const loadNotes = async () => {
    if (!account) return

    setIsLoading(true)
    try {
      const contract = getContract()
      if (contract) {
        const userNotes = await contract.methods.getNotes().call({ from: account })
        setNotes(userNotes || [])
      }
    } catch (error) {
      console.error("Error loading notes:", error)
      toast({
        title: "Error",
        description: "Failed to load notes from blockchain",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadNotesCount = async () => {
    if (!account) return

    try {
      const contract = getContract()
      if (contract) {
        const count = await contract.methods.getNotesCount().call({ from: account })
        setNotesCount(Number(count) || 0)
      }
    } catch (error) {
      console.error("Error loading notes count:", error)
    }
  }

  const saveNote = async () => {
    if (!account || !newNote.trim()) return

    setIsSaving(true)
    try {
      const contract = getContract()
      if (contract) {
        await contract.methods.saveNote(newNote.trim()).send({ from: account })

        toast({
          title: "Success!",
          description: "Note saved to blockchain",
        })

        setNewNote("")
        await loadNotes()
        await loadNotesCount()
      }
    } catch (error) {
      console.error("Error saving note:", error)
      toast({
        title: "Error",
        description: "Failed to save note to blockchain",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Wallet className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground max-w-md">
          Connect your Web3 wallet to start saving notes on the blockchain. Your notes will be permanently stored and
          accessible from anywhere.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Notes</p>
                <p className="text-2xl font-bold">{notesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Hash className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On-Chain Storage</p>
                <p className="text-2xl font-bold">∞</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Note
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write your note here... It will be permanently stored on the blockchain."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          <Button onClick={saveNote} disabled={!newNote.trim() || isSaving} className="w-full sm:w-auto">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving to Blockchain...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Save Note
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Notes List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Notes
            <Badge variant="secondary">{notes.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading notes...</span>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notes yet. Create your first note above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm leading-relaxed flex-1">{note}</p>
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
