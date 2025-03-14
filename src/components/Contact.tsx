import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Send, Mail, PhoneCall, MapPin, Loader2, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import GradientText from "./ui/gradient-text";
import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = "service_dtqz0po";
const EMAILJS_TEMPLATE_ID = "template_k5hrf5j";
const EMAILJS_PUBLIC_KEY = "Jz1OpL3dftxOApoVg";

// Rate limiting constants
const MAX_MESSAGES_PER_DAY = 5;
const HOURS_BEFORE_RESET = 24;

interface MessageLog {
  count: number;
  lastReset: number;
}

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rateLimit'>('idle');
  const [remainingMessages, setRemainingMessages] = useState(MAX_MESSAGES_PER_DAY);
  const { toast } = useToast();

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Define contactInfo array using translation values
  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5 text-primary" />,
      title: t.contact.email,
      value: "paulsson.pontus@gmail.com",
      link: "mailto:paulsson.pontus@gmail.com",
    },
    {
      icon: <PhoneCall className="w-5 h-5 text-primary" />,
      title: t.contact.phone,
      value: "+46 76 347 13 37",
      link: "tel:+46763471337",
    },
    {
      icon: <MapPin className="w-5 h-5 text-primary" />,
      title: t.contact.location,
      value: t.contact.locationValue,
      link: null,
    },
  ];

  // Check message rate limits on component mount
  useEffect(() => {
    checkMessageLimit();
  }, []);

  const checkMessageLimit = () => {
    const messageLog = localStorage.getItem('messageLog');
    if (messageLog) {
      const log: MessageLog = JSON.parse(messageLog);
      const hoursSinceReset = (Date.now() - log.lastReset) / (1000 * 60 * 60);

      if (hoursSinceReset >= HOURS_BEFORE_RESET) {
        // Reset if 24 hours have passed
        localStorage.setItem('messageLog', JSON.stringify({
          count: 0,
          lastReset: Date.now()
        }));
        setRemainingMessages(MAX_MESSAGES_PER_DAY);
      } else {
        setRemainingMessages(MAX_MESSAGES_PER_DAY - log.count);
      }
    } else {
      localStorage.setItem('messageLog', JSON.stringify({
        count: 0,
        lastReset: Date.now()
      }));
    }
  };

  const updateMessageCount = () => {
    const messageLog = localStorage.getItem('messageLog');
    if (messageLog) {
      const log: MessageLog = JSON.parse(messageLog);
      localStorage.setItem('messageLog', JSON.stringify({
        count: log.count + 1,
        lastReset: log.lastReset
      }));
      setRemainingMessages(MAX_MESSAGES_PER_DAY - (log.count + 1));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limit
    const messageLog = localStorage.getItem('messageLog');
    if (messageLog) {
      const log: MessageLog = JSON.parse(messageLog);
      const hoursSinceReset = (Date.now() - log.lastReset) / (1000 * 60 * 60);

      if (hoursSinceReset < HOURS_BEFORE_RESET && log.count >= MAX_MESSAGES_PER_DAY) {
        setSubmitStatus('rateLimit');
        toast({
          title: "Rate limit reached",
          description: "You've reached the maximum number of messages you can send today. Please try again tomorrow.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_name: "Pontus"
        },
        EMAILJS_PUBLIC_KEY
      );

      updateMessageCount();
      setSubmitStatus('success');
      setIsSuccess(true);

      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setIsSuccess(false);
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');

      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GradientText
                text={t.contact.title}
                from="from-rose-500"
                via="via-fuchsia-500"
                to="to-purple-600"
              />
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              {t.contact.reachMe}
              <br />
              {t.contact.availability}
            </p>
          </div>

          <div className={`grid md:grid-cols-5 gap-10 items-start transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <div className="md:col-span-2 space-y-8">
              <div>
                <p className="text-lg text-foreground/80 leading-relaxed mb-8">
                  {t.contact.description}
                </p>

                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start"
                    >
                      <div className="mr-4 mt-1 p-2 bg-white rounded-full shadow-sm">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60 mb-1">{item.title}</p>
                        {item.link ? (
                          <a
                            href={item.link}
                            className="text-lg font-medium hover:text-primary transition-colors duration-200"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-lg font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-sm border border-border"
              >
                {remainingMessages < MAX_MESSAGES_PER_DAY && remainingMessages > 0 && (
                  <div className="mb-4 text-sm text-amber-600 text-center p-2 bg-amber-50 rounded-lg">
                    {t.contact.form.remainingMessages.replace('{count}', remainingMessages.toString())}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground/70 mb-2">
                      {t.contact.form.name}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none"
                      placeholder={t.contact.form.namePlaceholder}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground/70 mb-2">
                      {t.contact.form.email}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none"
                      placeholder={t.contact.form.emailPlaceholder}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground/70 mb-2">
                    {t.contact.form.subject}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none"
                    placeholder={t.contact.form.subjectPlaceholder}
                  />
                </div>

                <div className="mb-8">
                  <label htmlFor="message" className="block text-sm font-medium text-foreground/70 mb-2">
                    {t.contact.form.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none resize-none"
                    placeholder={t.contact.form.messagePlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess || remainingMessages === 0}
                  className={`w-full flex items-center justify-center px-8 py-3.5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${submitStatus === 'success'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : submitStatus === 'error'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : submitStatus === 'rateLimit'
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-primary text-primary-foreground hover:shadow-lg hover:scale-[1.01]'
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      {t.contact.form.sending}
                    </>
                  ) : submitStatus === 'success' ? (
                    <>
                      <Check size={18} className="mr-2" />
                      {t.contact.form.success}
                    </>
                  ) : submitStatus === 'error' ? (
                    <>
                      <AlertCircle size={18} className="mr-2" />
                      {t.contact.form.error}
                    </>
                  ) : submitStatus === 'rateLimit' ? (
                    <>
                      <AlertCircle size={18} className="mr-2" />
                      {t.contact.form.rateLimit}
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      {t.contact.form.send}
                    </>
                  )}
                </button>

                {submitStatus === 'rateLimit' && (
                  <p className="mt-4 text-sm text-amber-600 text-center">
                    {t.contact.form.rateLimitExplanation}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-primary/5 rounded-full opacity-50 blur-3xl"></div>
    </section>
  );
};

export default Contact;
