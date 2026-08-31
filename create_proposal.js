const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, PageOrientation, LevelFormat, HeadingLevel,
        BorderStyle, WidthType, ShadingType, TableOfContents, PageNumber, PageBreak } = require('docx');
const fs = require('fs');

// Create the document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 24 } // 12pt default
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 }
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 }
      },
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 720, hanging: 360 }
              }
            }
          },
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: "○",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 1440, hanging: 360 }
              }
            }
          }
        ]
      },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: {
          width: 12240,
          height: 15840
        },
        margin: {
          top: 1440,
          right: 1440,
          bottom: 1440,
          left: 1440
        }
      }
    },
    children: [
      // COVER PAGE
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 2880 },
        children: [
          new TextRun({
            text: "ELECTROLUX ENERGY MANAGEMENT SYSTEM",
            bold: true,
            size: 36,
            font: "Arial",
            color: "2E75B6"
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 480 },
        children: [
          new TextRun({
            text: "(EMS)",
            bold: true,
            size: 32,
            font: "Arial",
            color: "2E75B6"
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 960 },
        children: [
          new TextRun({
            text: "PROJECT PROPOSAL",
            size: 28,
            font: "Arial"
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 960 },
        children: [
          new TextRun({
            text: "Huzaifa Abdul Rehman (23K-0782) - Team Leader",
            size: 24,
            font: "Arial"
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Muhammad Abdullah Khan (23K-0607)",
            size: 24,
            font: "Arial"
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Abdul Moiz Hussain (23K-0553)",
            size: 24,
            font: "Arial"
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 480 },
        children: [
          new TextRun({
            text: "Advisor: Asst. Prof. Engr. Abdul Rahman",
            size: 24,
            font: "Arial",
            italics: true
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 960 },
        children: [
          new TextRun({
            text: "Course: CS3009 - Software Engineering",
            size: 22,
            font: "Arial"
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "National University of Computer and Emerging Sciences",
            size: 22,
            font: "Arial"
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "FAST School of Computing, Karachi Campus",
            size: 22,
            font: "Arial"
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160 },
        children: [
          new TextRun({
            text: "Spring 2026",
            size: 22,
            font: "Arial",
            bold: true
          })
        ]
      }),

      // PAGE BREAK
      new Paragraph({ children: [new PageBreak()] }),

      // TABLE OF CONTENTS
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "TABLE OF CONTENTS", bold: true })]
      }),
      new TableOfContents("Summary", {
        hyperlink: true,
        headingStyleRange: "1-3"
      }),

      // PAGE BREAK
      new Paragraph({ children: [new PageBreak()] }),

      // 1. OVERVIEW
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("1. OVERVIEW")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun("The Electrolux Energy Management System (EMS) is a web-based electricity utility management platform designed to digitize and streamline the operations of electricity distribution companies, with a specific focus on challenges faced by K-Electric customers and staff in Karachi, Pakistan.")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun("The motivation for this project stems from the persistent inefficiencies in how electricity utility services are currently delivered in Pakistan - paper-based billing, manual meter readings, lack of transparent complaint resolution, and no centralized platform for customers to monitor their usage or manage payments.")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun("The system serves three types of users: residential and commercial electricity consumers (customers), field and office staff (employees), and utility company management (administrators). The project will deliver a fully functional, role-based web application covering billing, meter reading management, payment tracking, complaint handling, outage management, and analytical reporting.")]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun("The system is being developed by a team of three students over the remaining 8 weeks of the Spring 2026 semester. This project does not depend on any other ongoing projects, nor do any other projects depend on its outcome. It is a self-contained academic and practical deliverable.")]
      }),

      // 2. PROJECT DETAIL
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("2. PROJECT DETAIL")]
      }),

      // 2.1
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.1 Problem or Challenge")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun("K-Electric, the sole electricity distribution company serving Karachi, currently relies heavily on manual and paper-based processes for billing, meter reading, and customer service. Customers receive printed bills through physical delivery, have no way to track their consumption history online, and must visit physical offices to register complaints or inquire about payments. This creates significant inconvenience, particularly for working-class citizens and businesses that cannot afford frequent office visits.")]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun("Furthermore, the lack of a centralized digital platform leads to administrative inefficiencies on the utility side. Employees manually record meter readings on paper, which introduces human error and delays in bill generation. Complaint resolution has no formal tracking mechanism, leaving customers with no visibility into the status of their issues. Power outage schedules are not proactively communicated, causing disruption to residents and businesses across Karachi. These challenges collectively degrade the quality of service and erode customer trust in the utility company.")]
      }),

      // 2.2
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.2 Project Vision")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun("Our vision is to build a transparent, efficient, and accessible digital utility management platform that empowers electricity consumers in Karachi to take control of their accounts while enabling K-Electric staff and administrators to manage operations with greater accuracy and accountability.")]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun("The Electrolux Energy Management System aims to eliminate the gap between utility providers and their customers by providing a single, role-based web platform where customers can view and pay bills, track complaints, and monitor usage - while employees can record meter readings and manage work orders, and administrators can oversee all operations through dashboards and analytics. The ultimate goal is to deliver a solution that mirrors the standards of modern digital utility services seen globally, tailored specifically to the needs and constraints of Karachi's electricity infrastructure.")]
      }),

      // 2.3
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.3 Project Feasibility Study")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("2.3.1 Technical Feasibility")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun("The proposed system is technically feasible. The development team has the required skills in full-stack web development using modern frameworks. The chosen technology stack - Next.js, TypeScript, MySQL, and Drizzle ORM - is well-documented, widely supported, and appropriate for building scalable web applications. All tools used are open-source or freely available. The team has access to personal development machines capable of running the full stack locally. No specialized hardware or proprietary software licenses are required.")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("2.3.2 Operational Feasibility")]
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun("The system is operationally feasible. The web-based nature of the platform means end-users require only a modern browser and internet connection - no software installation needed. The role-based interface (Customer, Employee, Admin) ensures each user type sees only relevant functionality, reducing the learning curve. The system mirrors workflows already familiar to utility staff (meter reading, bill generation, complaint handling) but automates and digitizes them. From a management perspective, the admin dashboard provides consolidated views of operations, reducing the need for manual reporting.")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("2.3.3 Economic Feasibility")]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun("The system is economically feasible. The entire development stack is built on open-source and free-tier technologies, resulting in zero software licensing costs. Development is carried out by the student team at no labor cost. For a real-world deployment by K-Electric, the operational cost would be minimal compared to the savings gained from reduced paper billing, fewer manual processes, and decreased customer service overhead. The long-term economic benefit significantly outweighs the one-time development investment.")]
      }),

      // 2.4
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.4 Project Goals")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "FUNCTIONAL GOALS:", bold: true })]
      }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Provide customers with online access to their bills, payment history, and usage analytics.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Enable employees to record meter readings digitally and manage work orders.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Allow administrators to generate bulk bills, manage tariffs, and oversee complaints and outages.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Implement a formal complaint submission and tracking workflow.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [new TextRun("Provide a new electricity connection application and approval process.")] }),
      new Paragraph({
        children: [new TextRun({ text: "TECHNOLOGICAL GOALS:", bold: true })]
      }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Build the system using a modern, type-safe full-stack framework (Next.js + TypeScript).")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Use an ORM-based database layer (Drizzle ORM + MySQL) for maintainable, schema-driven data management.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [new TextRun("Implement secure role-based authentication using NextAuth with JWT session management.")] }),
      new Paragraph({
        children: [new TextRun({ text: "QUALITY GOALS:", bold: true })]
      }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Ensure data accuracy in billing through automated tariff slab calculations.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Maintain secure access control so each role can only access authorized resources.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [new TextRun("Provide a responsive UI accessible on both desktop and mobile browsers.")] }),
      new Paragraph({
        children: [new TextRun({ text: "ORGANIZATIONAL GOALS:", bold: true })]
      }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Apply Agile/Scrum methodology to structure development into manageable sprints.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [new TextRun("Deliver the project within the 8-week academic timeframe with all core features functional.")] }),
      new Paragraph({
        children: [new TextRun({ text: "CONSTRAINTS:", bold: true })]
      }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Development is constrained to the remaining 8 weeks of the Spring 2026 semester.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("The system will not integrate with live K-Electric APIs or real payment gateways (simulated).")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("IoT-based smart meter integration is out of scope.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Mobile native applications (iOS/Android) are out of scope.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 160 }, children: [new TextRun("System deployment to production is out of scope for this academic submission.")] }),

      // 2.5
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.5 Project Abstract")]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun("The Electrolux Energy Management System (EMS) is a comprehensive web-based solution designed to modernize electricity utility operations in Karachi, Pakistan. Addressing the inefficiencies of K-Electric's current paper-based and manual processes, this system provides a centralized digital platform for customers, employees, and administrators. Customers gain transparent access to bills, payment tracking, usage analytics, and complaint management. Employees can digitally record meter readings and manage work orders, while administrators oversee operations through dashboards, bulk billing, tariff management, and outage coordination. Built using Next.js, TypeScript, MySQL, and Drizzle ORM, the system employs role-based authentication, automated billing calculations, and responsive design to deliver a secure, efficient, and user-friendly experience. Developed over 8 weeks using Agile/Scrum methodology, this project aims to bridge the gap between utility providers and consumers, setting a new standard for digital utility management in Pakistan.")]
      }),

      // 2.6
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.6 Project Scope")]
      }),
      new Paragraph({ children: [new TextRun({ text: "IN SCOPE:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Web-based customer portal with bill viewing, payment tracking, usage analytics, complaint submission, and new connection applications.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Employee portal for digital meter reading recording, work order management, and reading request assignment.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Administrator portal for customer/employee management, bulk billing, tariff management, complaint oversight, and outage scheduling.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Automated tiered tariff slab calculation and bill generation engine.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Secure role-based authentication and authorization using NextAuth with JWT.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [new TextRun("20 core features as detailed in the Feature List section.")] }),
      new Paragraph({ children: [new TextRun({ text: "OUT OF SCOPE:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Native mobile applications (iOS/Android).")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Real-time integration with physical smart meters or IoT devices.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Online payment gateway integration (payments are recorded, not processed).")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("SMS or email notification systems.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 160 }, children: [new TextRun("Production deployment or hosting infrastructure setup.")] }),

      // 2.7 PROJECT TEAM
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.7 Project Team")]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun("Organization: National University of Computer and Emerging Sciences, FAST School of Computing, Karachi Campus. Course: CS3009 - Software Engineering, Spring 2026. Advisor: Asst. Prof. Engr. Abdul Rahman.")
        ]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun("All three team members contribute equally across the full stack — including frontend development, backend API design, database schema, testing, and documentation. No member is restricted to a single role.")]
      }),

      // Team table
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3120, 2080, 4160],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Name & Roll Number", bold: true, color: "FFFFFF" })] })]
              }),
              new TableCell({
                shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Availability", bold: true, color: "FFFFFF" })] })]
              }),
              new TableCell({
                shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Contribution", bold: true, color: "FFFFFF" })] })]
              }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Huzaifa Abdul Rehman (23K-0782) - Team Leader")] })] }),
              new TableCell({ margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("100%")] })] }),
              new TableCell({ margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Full-stack development, database, frontend, backend, testing")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Muhammad Abdullah Khan (23K-0607)")] })] }),
              new TableCell({ margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("100%")] })] }),
              new TableCell({ margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Full-stack development, database, frontend, backend, testing")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Abdul Moiz Hussain (23K-0553)")] })] }),
              new TableCell({ margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("100%")] })] }),
              new TableCell({ margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Full-stack development, database, frontend, backend, testing")] })] }),
            ]
          }),
        ]
      }),

      new Paragraph({ spacing: { before: 160, after: 160 }, children: [] }),

      // 2.8
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.8 Existing & Related Work")]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun("The table below compares Electrolux EMS against the existing K-Electric online portal and a generic international solution (SmartGrid Solutions):")]
      }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 2340, 2340, 2340],
        rows: [
          new TableRow({
            children: [
              new TableCell({ shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Feature", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "K-Electric Current", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "SmartGrid (US)", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Electrolux EMS", bold: true, color: "FFFFFF" })] })] }),
            ]
          }),
          ...[
            ["Online Bill Viewing", "Limited", "Yes", "Yes"],
            ["Bill Estimation Calculator", "No", "No", "Yes"],
            ["Usage Analytics / Graphs", "No", "Yes", "Yes"],
            ["Complaint Tracking Lifecycle", "No", "No", "Yes"],
            ["Zone-Based Outage Management", "No", "No", "Yes"],
            ["Meter Reading Request", "No", "No", "Yes"],
            ["New Connection Application", "Partial", "No", "Yes"],
            ["Employee Work Order Tools", "No", "Yes", "Yes"],
            ["Admin Bulk Bill Generation", "No", "No", "Yes"],
            ["Tiered Tariff Slab Calculation", "No", "No", "Yes"],
            ["Local Pakistan Focus", "Yes", "No", "Yes"],
          ].map(([feature, ke, sg, ems]) =>
            new TableRow({
              children: [
                new TableCell({ margins: { top: 60, bottom: 60, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun(feature)] })] }),
                new TableCell({ margins: { top: 60, bottom: 60, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun(ke)] })] }),
                new TableCell({ margins: { top: 60, bottom: 60, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun(sg)] })] }),
                new TableCell({ shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: ems, bold: true })] })] }),
              ]
            })
          )
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 160 },
        children: [
          new TextRun({ text: "Uniqueness of Electrolux EMS: ", bold: true }),
          new TextRun("Unlike generic international solutions, Electrolux EMS is specifically tailored to address Karachi's infrastructure constraints, K-Electric's operational workflows, and the socio-economic realities of Pakistani consumers. It provides comprehensive role-based functionality in a single integrated platform, emphasizing transparency, accountability, and ease of use for all stakeholders.")
        ]
      }),

      // 2.9
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.9 Proposed Solution & Architecture")]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun("Electrolux EMS follows a modern three-tier web architecture with a clear separation of concerns:")]
      }),
      new Paragraph({ children: [new TextRun({ text: "PRESENTATION LAYER:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [new TextRun("Built with Next.js 14 and React 18, using Tailwind CSS for responsive styling. Provides role-specific dashboards and UI components for Customer, Employee, and Admin users.")] }),
      new Paragraph({ children: [new TextRun({ text: "APPLICATION LAYER:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [new TextRun("Next.js API routes handle business logic, authentication (NextAuth with JWT), billing calculations, meter reading workflows, complaint management, and role-based access control.")] }),
      new Paragraph({ children: [new TextRun({ text: "DATA LAYER:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [new TextRun("MySQL 8.0 database managed through Drizzle ORM with a 20-table schema covering users, customers, employees, bills, payments, meter readings, complaints, outages, tariffs, and more.")] }),
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({ text: "Architecture Flow: ", bold: true }),
          new TextRun("[Browser / Client] → [Next.js Frontend - React Components + Pages] → [Next.js API Routes - Business Logic + Auth Middleware] → [Drizzle ORM - Type-Safe Query Builder] → [MySQL 8.0 Database - 20 Tables]. A labeled block diagram is included in the attached architecture diagram.")
        ]
      }),

      // 2.10
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.10 Use Case Model")]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun("[See attached file: usecase_diagram.pdf]")]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun("The system involves three primary actors: Customer, Employee, and Administrator. Key use cases per actor:")]
      }),
      new Paragraph({ children: [new TextRun({ text: "CUSTOMER:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("View/download bills, estimate bill, track payments, view usage analytics, submit complaints, request meter reading, apply for new connection, manage account.")] }),
      new Paragraph({ children: [new TextRun({ text: "EMPLOYEE:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Record meter readings, view assigned reading requests, manage work orders.")] }),
      new Paragraph({ children: [new TextRun({ text: "ADMINISTRATOR:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 160 }, children: [new TextRun("Manage customers/employees, generate bulk bills, configure tariffs, resolve complaints, schedule outages, assign reading requests, view system analytics, manage password reset requests.")] }),

      // PAGE BREAK
      new Paragraph({ children: [new PageBreak()] }),

      // 2.11
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.11 Feature List")]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun("The following 20 core domain features define the functional scope of Electrolux EMS. Login/logout and dashboards are excluded as generic features.")]
      }),

      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Role-Based Portal System: ", bold: true }), new TextRun("Dedicated web portals for Customer, Employee, and Admin roles with JWT-based session management and route-level access control.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Electricity Bill Generation: ", bold: true }), new TextRun("Automatic generation of monthly electricity bills based on meter readings and applicable tariff.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Tiered Tariff Slab Calculation: ", bold: true }), new TextRun("Automated calculation of charges using progressive slab-based tariff rates per customer category.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Bulk Bill Generation with Preview: ", bold: true }), new TextRun("Admin generates bills for all customers in a single operation with preview and confirmation.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Online Bill Viewing & Download: ", bold: true }), new TextRun("Customers view detailed bills with slab breakdown, taxes, due dates and download/print them.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Bill Estimation Calculator: ", bold: true }), new TextRun("Customers estimate their bill by entering units consumed, calculated against current tariff slabs.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Payment Recording & Tracking: ", bold: true }), new TextRun("Record payments against bills with automatic status updates (paid/unpaid/overdue) and full history.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Meter Reading Recording by Employee: ", bold: true }), new TextRun("Field employees digitally submit meter readings for assigned customers.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Meter Reading Request by Customer: ", bold: true }), new TextRun("Customers formally request a meter reading through the portal, initiating an assignment workflow.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Reading Request Assignment to Employee: ", bold: true }), new TextRun("Admins assign pending meter reading requests to specific field employees for fulfillment.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Employee Work Order Management: ", bold: true }), new TextRun("Employees view, update, and complete assigned work orders.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Customer Management (Admin): ", bold: true }), new TextRun("Admins create, view, edit, and deactivate customer accounts.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Employee Management (Admin): ", bold: true }), new TextRun("Admins manage employee accounts and work assignments.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Tariff Rate Management: ", bold: true }), new TextRun("Admins define and update electricity tariff categories and slab rates.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Customer Usage Analytics: ", bold: true }), new TextRun("Visual charts showing monthly consumption trends and cost patterns for customers.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Administrative Analytics & Reporting: ", bold: true }), new TextRun("System-wide analytics covering revenue, consumption by zone, complaint volumes, and outage stats.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Complaint Submission & Tracking: ", bold: true }), new TextRun("Customers submit complaints and track resolution through a formal lifecycle: submitted → in progress → resolved.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Zone-Based Outage Management: ", bold: true }), new TextRun("Outages are scheduled, recorded, and tracked by geographic zone.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "New Connection Application & Tracking: ", bold: true }), new TextRun("Customers apply for a new electricity connection and track approval status.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 160 }, children: [new TextRun({ text: "Password Reset Request & Tracking: ", bold: true }), new TextRun("Customers submit password reset requests through the portal; admins track and process them.")] }),

      // 2.12
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.12 Software Development Methodology")]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun("Electrolux EMS will be developed using the "),
          new TextRun({ text: "Agile Software Development Methodology", bold: true }),
          new TextRun(", specifically following the "),
          new TextRun({ text: "Scrum framework", bold: true }),
          new TextRun(". The feature set is decomposed into user stories grouped into 2-week sprints. Regular sprint reviews allow early detection of issues. All three team members participate equally in planning, development, and review activities.")
        ]
      }),
      new Paragraph({ children: [new TextRun({ text: "Sprint Structure (4 sprints, 2 weeks each, 8 weeks total):", bold: true })] }),
      new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "Sprint 1 (Weeks 1-2):", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Project setup, repository initialization, database schema (20 tables), authentication system, role-based portal base structure.")] }),
      new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "Sprint 2 (Weeks 3-4):", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Bill viewing & download, bill calculator, payment tracking, usage analytics, billing engine (tariff slab calculation), bulk bill generation.")] }),
      new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "Sprint 3 (Weeks 5-6):", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Meter reading recording, meter reading requests & assignment, employee work orders, customer/employee management (admin), tariff management, new connection application & tracking.")] }),
      new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "Sprint 4 (Weeks 7-8):", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 160 }, children: [new TextRun("Complaint submission & tracking, zone-based outage management, bill request workflow, password reset & tracking, account balance & arrears, system-wide testing, documentation.")] }),

      // 2.13
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.13 Proposed Infrastructure, Platform and Tools")]
      }),
      new Paragraph({ children: [new TextRun({ text: "PROGRAMMING LANGUAGES:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("TypeScript, JavaScript, SQL")] }),
      new Paragraph({ children: [new TextRun({ text: "FRAMEWORKS & LIBRARIES:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Next.js 14, React 18, Tailwind CSS, Drizzle ORM, NextAuth v4, Chart.js / React-ChartJS-2, Zod, React Hook Form, bcryptjs, Framer Motion, Lucide React, Axios, date-fns")] }),
      new Paragraph({ children: [new TextRun({ text: "DATABASE:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("MySQL 8.0")] }),
      new Paragraph({ children: [new TextRun({ text: "DEVELOPMENT TOOLS:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Visual Studio Code, Git, GitHub, MySQL Workbench, Drizzle Studio, Postman, Node.js 18+, npm")] }),
      new Paragraph({ children: [new TextRun({ text: "DESIGN & DOCUMENTATION:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 160 }, children: [new TextRun("draw.io / diagrams.net (use case diagrams), ProjectLibre (Gantt chart)")] }),

      // 2.14
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.14 Project Timeline")]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: "[See attached file: gantt_chart.pdf]", italics: true })]
      }),
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun("8-week sprint-based timeline summary for Spring 2026:")] }),
      new Paragraph({ children: [new TextRun({ text: "Week 1-2 (Sprint 1):", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Project setup, repository, DB schema (20 tables), authentication, role-based portal structure.")] }),
      new Paragraph({ children: [new TextRun({ text: "Week 3-4 (Sprint 2):", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Bill viewing & download, bill calculator, payment tracking, usage analytics, billing engine, bulk bill generation.")] }),
      new Paragraph({ children: [new TextRun({ text: "Week 5-6 (Sprint 3):", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Meter reading recording, reading requests & assignment, work orders, customer/employee management, tariff management, connection application.")] }),
      new Paragraph({ children: [new TextRun({ text: "Week 7-8 (Sprint 4):", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 160 }, children: [new TextRun("Complaint tracking, outage management, bill request workflow, password reset, account balance, system testing, documentation.")] }),

      // 2.15
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.15 Mockups (Optional)")]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({ text: "Not included in this submission.", italics: true })]
      }),

      // PAGE BREAK
      new Paragraph({ children: [new PageBreak()] }),

      // 2.16
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.16 References")]
      }),
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun("[1] K-Electric Limited, \"Customer Services,\" K-Electric Official Website. [Online]. Available: https://www.ke.com.pk. [Accessed: Feb. 2026].")] }),
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun("[2] V. Verma and A. Sharma, \"Design and Development of an Electricity Billing Management System,\" "), new TextRun({ text: "International Journal of Computer Applications", italics: true }), new TextRun(", vol. 120, no. 21, pp. 1-5, June 2015.")] }),
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun("[3] Next.js Documentation, \"Next.js 14 App Router,\" Vercel Inc. [Online]. Available: https://nextjs.org/docs. [Accessed: Feb. 2026].")] }),
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun("[4] Drizzle ORM Documentation, \"Drizzle ORM - TypeScript ORM for SQL databases.\" [Online]. Available: https://orm.drizzle.team. [Accessed: Feb. 2026].")] }),
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun("[5] A. Stellman and J. Greene, "), new TextRun({ text: "Learning Agile: Understanding Scrum, XP, Lean, and Kanban", italics: true }), new TextRun(". Sebastopol, CA: O'Reilly Media, 2014.")] }),
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun("[6] NEPRA, \"National Electric Power Regulatory Authority - Tariff Determinations,\" NEPRA Official Website. [Online]. Available: https://www.nepra.org.pk. [Accessed: Feb. 2026].")] }),
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun("[7] T. Connolly and C. Begg, "), new TextRun({ text: "Database Systems: A Practical Approach to Design, Implementation, and Management", italics: true }), new TextRun(", 6th ed. Harlow, UK: Pearson Education, 2015.")] }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 960 },
        children: [new TextRun({ text: "END OF PROPOSAL", bold: true, size: 24 })]
      })
    ]
  }]
});

// Generate the document
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("Electrolux_EMS_Proposal.docx", buffer);
  console.log("Document created successfully: Electrolux_EMS_Proposal.docx");
}).catch(error => {
  console.error("Error creating document:", error);
});
