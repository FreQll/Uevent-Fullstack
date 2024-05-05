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
import { updateEvent, updateEventPreview } from "@/helper/actions";
import { toastError, toastSuccess } from "@/helper/toast";
import Image from "next/image";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
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

export default function EditEventForm({ event, id }: { event: EventType, id: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: event.name,
      content: event.content,
      format: event.format,
      price: event.price,
      maxTickets: event.maxTickets,
      start: new Date(event.start),
      end: new Date(event.end),
      latitude: event.latitude,
      longitude: event.longitude,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await updateEvent(event.id, data);
  }

  const onLocationSelected = (lat: number, lng: number) => {
    form.setValue("latitude", lat);
    form.setValue("longitude", lng);
    console.log(lat, lng, "Location selected");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const formData = new FormData();
      formData.append("preview", e.target.files[0]);

      const response = await updateEventPreview(id, formData);
      if (response === 200) {
        // console.log("Event Preview Updated!");
        toastSuccess("Event Preview Updated!");
      } else if (response === 400) {
        // console.log("Error updating event preview!");
        toastError("Invalid file type or no file selected!");
      }
    }
  };

  return (
    <div className=" max-w-[1300px] w-[100%] m-auto px-[20px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex gap-10">
            <div className="flex flex-col gap-4 w-[100%]">
              <div className=" text-3xl font-semibold">Edit event</div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Event name" {...field} autoFocus className=" text-2xl w-[100%] border-none p-0 outline-none rounded-none focus-visible:ring-transparent border-b" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <hr />
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event format" className="w-fit" />
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
            </div>
            <div className="cursor-pointer relative w-[50%]">
              <Image
                width={500}
                height={500}
                src={`http://localhost:3001/api/event/preview/${id}`}
                alt="preview"
              />
              <label htmlFor="edit_preview"
                className=" absolute w-[100%] h-[100%] top-0 left-0 cursor-pointer"
                ></label>
              <input
                id="edit_preview"
                type="file"
                className="hidden"
                accept="accept"
                onChange={(e) => handleFileChange(e)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">

            <div className="col-span-1">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Ticket</FormLabel>
                    <FormControl>
                      <Input placeholder="Price" {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-1/2">
              <FormField
                control={form.control}
                name="maxTickets"
                render={({ field }) => (
                  <FormItem>
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

            <div className="col-span-1">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start of Event</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
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
            <div className="col-span-1/2">
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End of Event</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
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
            
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell other people a little bit about this event..."
                        className=" min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <LocationPicker
            lat={event.latitude}
            lng={event.longitude}
            onLocationSelected={onLocationSelected}
          />

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

    </div>
  );
}
