import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

export type ClassEmailProps = {
  preview: string;
  eyebrow: string;
  heading: string;
  studentName: string;
  className: string;
  date: string;
  time: string;
  timezone: string;
  location: string;
  message: string;
  meetingUrl?: string | null;
  supportEmail: string;
};

export function ClassEmail({ preview, eyebrow, heading, studentName, className, date, time, timezone, location, message, meetingUrl, supportEmail }: ClassEmailProps) {
  return <Html><Head /><Preview>{preview}</Preview><Body style={body}><Container style={container}>
    <Section style={brand}><Text style={brandMark}>AC</Text><Text style={brandName}>AI Clarity Sessions</Text></Section>
    <Text style={eyebrowStyle}>{eyebrow}</Text><Heading style={headingStyle}>{heading}</Heading>
    <Text style={copy}>Hello {studentName},</Text><Text style={copy}>{message}</Text>
    <Section style={details}><Text style={detailLabel}>CLASS</Text><Text style={detailValue}>{className}</Text><Hr style={hr} /><Text style={detailLabel}>DATE &amp; TIME</Text><Text style={detailValue}>{date}<br />{time} ({timezone})</Text><Hr style={hr} /><Text style={detailLabel}>LOCATION</Text><Text style={detailValue}>{location}</Text></Section>
    {meetingUrl ? <Button href={meetingUrl} style={button}>Open online classroom</Button> : null}
    <Text style={copy}><strong>What to bring:</strong> a charged laptop or tablet, its charger, and your questions.</Text>
    <Hr style={hr} /><Text style={footer}>Need help? Reply to this email or contact {supportEmail}. Please do not forward private online-class links.</Text>
  </Container></Body></Html>;
}

export const ConfirmationEmail = (props: Omit<ClassEmailProps, "eyebrow" | "heading" | "preview" | "message">) => <ClassEmail {...props} eyebrow="REGISTRATION CONFIRMED" heading="Your seat is reserved." preview={`Registration confirmed for ${props.className}`} message="Your payment and class registration are confirmed. Add the attached calendar event and keep this email for your records." />;
export const Reminder24HourEmail = (props: Omit<ClassEmailProps, "eyebrow" | "heading" | "preview" | "message">) => <ClassEmail {...props} eyebrow="CLASS REMINDER" heading="We’ll see you tomorrow." preview={`${props.className} starts tomorrow`} message="Your class begins in about 24 hours. Review the details below and make sure your device is charged and ready." />;
export const Reminder2HourEmail = (props: Omit<ClassEmailProps, "eyebrow" | "heading" | "preview" | "message">) => <ClassEmail {...props} eyebrow="STARTING SOON" heading="Your class starts in about two hours." preview={`${props.className} starts soon`} message="It is almost time. Settle in, bring your questions, and use the private classroom button below if this is an online session." />;
export const ScheduleChangeEmail = (props: Omit<ClassEmailProps, "eyebrow" | "heading" | "preview" | "message">) => <ClassEmail {...props} eyebrow="SCHEDULE UPDATED" heading="Your class details changed." preview={`Updated schedule for ${props.className}`} message="Please review the updated class details below and replace any earlier calendar entry. Contact us if the new schedule does not work for you." />;
export const CancellationEmail = (props: Omit<ClassEmailProps, "eyebrow" | "heading" | "preview" | "message">) => <ClassEmail {...props} eyebrow="CLASS CANCELLED" heading="This class has been cancelled." preview={`Cancellation notice for ${props.className}`} message="We are sorry, but this class will not take place as scheduled. Reply to this email for rescheduling or refund assistance." />;
export const InternalRegistrationEmail = (props: Omit<ClassEmailProps, "eyebrow" | "heading" | "preview" | "message">) => <ClassEmail {...props} eyebrow="NEW REGISTRATION" heading="A student registered." preview={`New registration for ${props.className}`} message="A validated Stripe payment created a confirmed registration. Review the operational details below." />;

const body={margin:"0",backgroundColor:"#f0f0ea",fontFamily:"Arial, sans-serif",color:"#101119"};
const container={maxWidth:"600px",margin:"0 auto",padding:"40px 24px"};
const brand={display:"flex",alignItems:"center",marginBottom:"40px"};
const brandMark={display:"inline-block",margin:"0 10px 0 0",borderRadius:"10px",backgroundColor:"#101119",padding:"10px",color:"#c8ff63",fontSize:"12px",fontWeight:"bold"};
const brandName={display:"inline-block",margin:"0",fontWeight:"bold"};
const eyebrowStyle={margin:"0 0 12px",color:"#6558ee",fontSize:"11px",fontWeight:"bold",letterSpacing:"2px"};
const headingStyle={margin:"0 0 24px",fontSize:"40px",lineHeight:"1.05",letterSpacing:"-2px"};
const copy={fontSize:"16px",lineHeight:"1.7",color:"#43444c"};
const details={margin:"28px 0",borderRadius:"18px",backgroundColor:"#ffffff",padding:"22px"};
const detailLabel={margin:"0 0 5px",color:"#6558ee",fontSize:"10px",fontWeight:"bold",letterSpacing:"1.5px"};
const detailValue={margin:"0",fontSize:"16px",fontWeight:"bold",lineHeight:"1.55"};
const hr={borderColor:"#ddddda",margin:"18px 0"};
const button={display:"block",margin:"24px 0",borderRadius:"999px",backgroundColor:"#101119",padding:"14px 22px",color:"#ffffff",fontWeight:"bold",textAlign:"center" as const,textDecoration:"none"};
const footer={color:"#73747b",fontSize:"12px",lineHeight:"1.6"};
