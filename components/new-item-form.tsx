'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createItem } from '@/lib/items/actions'

const STATUSES = [
  { value: 'owned', label: 'Owned' },
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'borrowed', label: 'Borrowed' },
  { value: 'sold', label: 'Sold' },
]

const BOARD_GAME_TYPES = [
  { value: 'strategy', label: 'Strategy' },
  { value: 'party', label: 'Party Game' },
  { value: 'rpg', label: 'RPG' },
  { value: 'cooperative', label: 'Cooperative' },
  { value: 'deck-building', label: 'Deck Building' },
  { value: 'war-game', label: 'War Game' },
  { value: 'euro-game', label: 'Euro Game' },
  { value: 'card-game', label: 'Card Game' },
  { value: 'family', label: 'Family' },
  { value: 'other', label: 'Other' },
]



// Base schema
const baseItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(1000, 'Description is too long').optional().or(z.literal('')),
  status: z.string(),
  notes: z.string().max(1000, 'Notes are too long').optional().or(z.literal('')),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

// Board game specific fields
const boardGameSchema = baseItemSchema.extend({
  publisher: z.string().max(200).optional().or(z.literal('')),
  minPlayers: z.string().max(10).optional().or(z.literal('')),
  maxPlayers: z.string().max(10).optional().or(z.literal('')),
  gameType: z.string().optional().or(z.literal('')),
  playTime: z.string().max(50).optional().or(z.literal('')),
  minAge: z.string().max(20).optional().or(z.literal('')),
  pricePaid: z.string().max(20).optional().or(z.literal('')),
  yearPublished: z.string().max(4).optional().or(z.literal('')),
})

type ItemFormValues = z.infer<typeof boardGameSchema>

interface NewItemPageProps {
  collectionId: string
  collectionName: string
  collectionCategory: string
}

export default function NewItemForm({ collectionId, collectionName, collectionCategory }: NewItemPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const isBoardGame = collectionCategory === 'board-games'

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(isBoardGame ? boardGameSchema : baseItemSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'owned',
      notes: '',
      imageUrl: '',
      // Board game fields
      publisher: '',
      minPlayers: '',
      maxPlayers: '',
      gameType: '',
      playTime: '',
      minAge: '',
      pricePaid: '',
      yearPublished: '',
    },
  })

  async function onSubmit(values: ItemFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('description', values.description || '')
      formData.append('status', values.status)
      formData.append('notes', values.notes || '')
      formData.append('imageUrl', values.imageUrl || '')

      // Add category-specific fields to customFields
      if (isBoardGame) {
        const customFields: Record<string, string> = {}
        if ('publisher' in values && values.publisher) customFields.publisher = values.publisher
        if ('minPlayers' in values && values.minPlayers) customFields.minPlayers = values.minPlayers
        if ('maxPlayers' in values && values.maxPlayers) customFields.maxPlayers = values.maxPlayers
        if ('gameType' in values && values.gameType) customFields.gameType = values.gameType
        if ('playTime' in values && values.playTime) customFields.playTime = values.playTime
        if ('minAge' in values && values.minAge) customFields.minAge = values.minAge
        if ('pricePaid' in values && values.pricePaid) customFields.pricePaid = values.pricePaid
        if ('yearPublished' in values && values.yearPublished) customFields.yearPublished = values.yearPublished
        
        if (Object.keys(customFields).length > 0) {
          formData.append('customFields', JSON.stringify(customFields))
        }
      }

      await createItem(collectionId, formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1">
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Button>
          <h1 className="text-4xl font-bold tracking-tight">Add Item</h1>
          <p className="text-muted-foreground mt-2">
            Add a new item to {collectionName}
          </p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>
              Provide information about the item you&apos;re adding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter item title"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        The name of the item
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATUSES.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Do you own this, want it, or have you borrowed it?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Board Game Specific Fields */}
                {isBoardGame && (
                  <>
                    <FormField
                      control={form.control}
                      name="publisher"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publisher (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Fantasy Flight Games"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormDescription>
                            The company that published this game
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gameType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Game Type (Optional)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {BOARD_GAME_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="minPlayers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min Players (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="e.g., 1"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxPlayers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Players (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="e.g., 4"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="playTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Play Time (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 60 min"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="minAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min Age (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 12+"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="yearPublished"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 2023"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="pricePaid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Paid (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., $49.99"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormDescription>
                            How much you paid for this game
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe this item..."
                          className="resize-none"
                          rows={3}
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Additional details about the item
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to an image of the item
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any additional notes..."
                          className="resize-none"
                          rows={3}
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Personal notes about this item
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? 'Adding...' : 'Add Item'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
