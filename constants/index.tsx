export const CONTRACT_ADDRESS = "0xafb6b7ce7874805552d86a621a54d4873ae05e03"

export const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "uint256", name: "noteIndex", type: "uint256" },
    ],
    name: "NoteSaved",
    type: "event",
  },
  {
    inputs: [],
    name: "getNotes",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNotesCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "note", type: "string" }],
    name: "saveNote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const
