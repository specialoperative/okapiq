"use server"

export async function scheduleDemo(formData: FormData) {
  try {
    // In a real implementation, you would use an email service like SendGrid, Mailgun, etc.
    // For now, we'll log the information that would be sent
    const email = formData.get("email") || "osiris@rollupbiz.com"
    const name = formData.get("name") || "Potential Customer"

    console.log(`Demo request received:
      Email: ${email}
      Name: ${name}
      Destination: osiris@rollupbiz.com
      Message: Request for demo to access data points on Reference USA and financial information
    `)

    // In a real implementation, you would send an email here
    // For example with SendGrid:
    // await sendgrid.send({
    //   to: 'osiris@rollupbiz.com',
    //   from: 'noreply@okapiq.com',
    //   subject: 'New Demo Request',
    //   text: `New demo request from ${name} (${email}). They are interested in accessing Reference USA data points and financial information.`,
    // })

    // Also send an automated confirmation email to the user
    // await sendgrid.send({
    //   to: email,
    //   from: 'osiris@rollupbiz.com',
    //   subject: 'Your OkapIQ Demo Request',
    //   text: `Thank you for your interest in OkapIQ! We've received your request for a demo to explore our database of 10,000+ qualified leads and financial data points from Reference USA. We'll be in touch shortly to schedule your demo.`,
    // })

    // For demo purposes, we'll just redirect to a thank you page
    return { success: true }
  } catch (error) {
    console.error("Error scheduling demo:", error)
    return { success: false, error: "Failed to schedule demo. Please try again." }
  }
}

