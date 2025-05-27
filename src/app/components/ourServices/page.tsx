import { Client } from "@clerk/nextjs/server";
import React from "react";

// const services = [
//   {
//     title: "Child-Focused Support",
//     points: [
//       "Personalized sessions focused on emotional regulation, social skills, and coping strategies",
//       "Safe, supportive environment where children feel heard and understood",
//       "Evidence-based techniques tailored to each child’s unique needs",
//     ],
//   },
//   {
//     title: "Parent Guidance and Support",
//     points: [
//       "Coaching on effective communication and emotional support strategies",
//       "Psychoeducation to help parents understand and respond to their child’s needs",
//       "Tools to manage stress and foster a secure home environment",
//     ],
//   },
//   {
//     title: "School Collaboration and Training",
//     points: [
//       "Partnering with schools to develop individualized support plans",
//       "Teacher training on emotional regulation and social skills development",
//       "Ongoing communication with educators to ensure consistent support",
//     ],
//   },
//   {
//     title: "Family Focused Sessions",
//     points: [
//       "Sessions involving both the child and family members",
//       "Focus on improving family communication and dynamics",
//       "Helping parents and siblings understand and support the child’s emotional needs",
//     ],
//   },
//   {
//     title: "Emotional and Social Skills Coaching",
//     points: [
//       "One-on-one coaching for children and adolescents",
//       "Focus on building confidence in peer relationships and emotional expression",
//       "Practical tools for handling conflict, stress, and communication challenges",
//     ],
//   },
//   {
//     title: "Transition Support",
//     points: [
//       "Support for children navigating key life changes (e.g., school transitions, family changes)",
//       "Building emotional resilience and coping strategies",
//       "Guidance for parents and teachers to ease the adjustment period",
//     ],
//   },
//   {
//     title: "Teacher and School Staff Consultation",
//     points: [
//       "Individual and group consultations for teachers and school counselors",
//       "Guidance on managing classroom dynamics and student behavior",
//       "Strategies to foster a more inclusive and supportive learning environment",
//     ],
//   },
//   {
//     title: "Collaboration with Specialists and Doctors",
//     points: [
//       "Partnering with pediatricians, physiotherapists, occupational therapists, psychiatrists and speech therapists",
//       "Coordinating care to address complex emotional, developmental, and physical needs",
//     ],
//   },
//   {
//     title: "Group Sessions and Workshops",
//     points: [
//       "Parent workshops on emotional regulation and behavior management",
//       "Teacher training sessions focused on building emotional resilience in the classroom",
//     ],
//   },
//   {
//     title: "Research Partnerships",
//     points: [
//       "Collaborating with universities and research institutions to advance understanding of child development and mental health",
//       "Applying the latest research to inform and improve therapeutic approaches",
//       "Conducting outcome-based studies to measure the effectiveness of interventions and refine best practices",
//     ],
//   },
// ];

const OurServices = () => {
  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="mx-auto mt-10 flex justify-center px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-10 lg:px-8">
          <div className="text-center ">
            <h1
              className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-slate-200 sm:text-5xl md:text-6xl">
              <span className="block xl:inline"><span className="mb-1 block">Create amazing</span>
                <span className="bg-gradient-to-r from-indigo-400 to-pink-600 bg-clip-text text-transparent">
                  Tool to develop our future
                </span>
              </span>
              <div className="mt-2">10X faster
                <span className="relative mt-3 whitespace-nowrap text-blue-600"><svg aria-hidden="true" viewBox="0 0 418 42"
                  className="absolute top-3/4 left-0 right-0 m-auto h-[0.58em] w-fit fill-pink-400/50"
                  preserveAspectRatio="none">
                  <path
                    d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z">
                  </path>
                </svg>
                  <span className="relative"> with AI tools.</span>
                </span>
              </div>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-lg text-gray-500 sm:mt-5 md:mt-5">
              example is the AI Content Generator
              that helps you and your team break through creative blocks to create amazing, original content 10X
              faster.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center p-8">
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          Why to choose US?
        </h2>


        <div className="flex flex-wrap items-center mt-20 text-center">
          <div className="w-full md:w-3/5 lg:w-1/2 px-4">
            <img src="https://picsum.photos/400/240" alt="editor" className="inline-block rounded shadow-lg border border-merino-400" />
          </div>
          <div className="w-full md:w-2/5 lg:w-1/2 px-4 text-center md:text-left lg:pl-12">
            <h3 className="font-bold mt-8 text-xl md:mt-0 sm:text-2xl">
              Child-Focused Support
            </h3>
            <p className="sm:text-lg mt-6">
              Personalized sessions focused on emotional regulation,
              social skills, and coping strategies Safe,
              supportive environment where children feel heard and understood,
              Evidence-based techniques tailored to each child’s unique needs,
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center  mt-20 text-left  ">
          <div className="w-full md:w-3/5 lg:w-1/2 px-4">
            <img src="https://picsum.photos/400/240" alt="project members" className="inline-block rounded shadow-lg border border-merino-400" />
          </div>
          <div className="w-full md:w-2/5 lg:w-1/2 px-4 md:order-first text-center md:text-left lg:pr-12">
            <h3 className="font-bold mt-8 text-xl md:mt-0 sm:text-2xl">
              Parent Guidance and Support
            </h3>
            <p className="sm:text-lg mt-6">
              Coaching on effective communication and emotional support strategies
              Psychoeducation to help parents understand and respond to their child’s needs
              Tools to manage stress and foster a secure home environment
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center mt-20  text-center">
          <div className="w-full md:w-3/5 lg:w-1/2 px-4">
            <img src="https://picsum.photos/400/240" alt="editor" className="inline-block rounded shadow-lg border border-merino-400" />
          </div>
          <div className="w-full md:w-2/5 lg:w-1/2 px-4 text-center md:text-left lg:pl-12">
            <h3 className="font-bold mt-8 text-xl md:mt-0 sm:text-2xl">
              School Collaboration and Training
            </h3>
            <p className="sm:text-lg mt-6">
              Partnering with schools to develop individualized support plans
              Teacher training on emotional regulation and social skills development
              Ongoing communication with educators to ensure consistent support
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center mt-20 text-center">
          <div className="w-full md:w-3/5 lg:w-1/2 px-4">
            <img src="https://picsum.photos/400/240" alt="bulk editing" className="inline-block rounded shadow-lg border border-merino-400" />
          </div>
          <div className="w-full md:w-2/5 lg:w-1/2 px-4 md:order-first text-center md:text-left lg:pr-12">
            <h3 className="font-bold mt-8 text-xl md:mt-0 sm:text-2xl">
              Family Focused Sessions
            </h3>
            <p className="sm:text-lg mt-6">
              Sessions involving both the child and family members
              Focus on improving family communication and dynamics
              Helping parents and siblings understand and support the child’s emotional needs
            </p>
          </div>
        </div>
      </div>

      {/* <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-violet-800">Our Services</h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-violet-700">{service.title}</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {service.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div> */}

    </div>
  );
};

export default OurServices;
