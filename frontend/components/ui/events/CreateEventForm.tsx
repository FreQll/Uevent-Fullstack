"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EventType, TopicType } from "@/helper/types";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventFormat } from "@/helper/enums";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import LocationPicker from "../LocationPicker";
import { createEvent, updateEvent } from "@/helper/actions";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  format: z.string({
    required_error: "Please select an email to display.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be at least 0.",
  }),
  maxTickets: z.coerce.number().min(0, {
    message: "Tickets must be at least 0.",
  }),
  start: z.date({
    required_error: "Start date of event is required.",
  }),
  end: z.date({
    required_error: "End date of event is required.",
  }),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

export default function CreateEventForm({ userId }: { userId: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      content: "",
      format: "",
      price: 0,
      maxTickets: 0,
      start: new Date(),
      end: new Date(),
      latitude: Number(49.829958199491415),
      longitude: Number(36.3788957),
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await createEvent(data, userId);
  }

  const onLocationSelected = (lat: number, lng: number) => {
    form.setValue("latitude", lat);
    form.setValue("longitude", lng);
    console.log(lat, lng, "Location selected");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Event name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell other people a little bit about this event..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem className="w-[-webkit-fill-available]">
                <FormLabel>Event Format</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(
                      Object.keys(EventFormat) as Array<keyof typeof EventFormat>
                    ).map((format) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-[-webkit-fill-available]">
                <FormLabel>Price per Ticket</FormLabel>
                <FormControl>
                  <Input placeholder="Price" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxTickets"
            render={({ field }) => (
              <FormItem className="w-[-webkit-fill-available]">
                <FormLabel>Maximum available tickets</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Maximum tickets for event"
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem className="flex flex-col w-[-webkit-fill-available]">
                <FormLabel>Start of Event</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[100%] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem className="flex flex-col w-[-webkit-fill-available]">
                <FormLabel>End of Event</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[100%] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
          
        <div className="flex flex-col gap-2">
          <FormLabel>Location</FormLabel>
          <LocationPicker
            lat={event?.latitude}
            lng={event?.longitude}
            onLocationSelected={onLocationSelected}
          />
        </div>

        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => <input type="hidden" {...field} />}
        />

        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => <input type="hidden" {...field} />}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
