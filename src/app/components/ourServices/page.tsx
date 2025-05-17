import { Client } from "@clerk/nextjs/server";
import React from "react";

const services = [
  {
    title: "Child-Focused Support",
    points: [
      "Personalized sessions focused on emotional regulation, social skills, and coping strategies",
      "Safe, supportive environment where children feel heard and understood",
      "Evidence-based techniques tailored to each child’s unique needs",
    ],
  },
  {
    title: "Parent Guidance and Support",
    points: [
      "Coaching on effective communication and emotional support strategies",
      "Psychoeducation to help parents understand and respond to their child’s needs",
      "Tools to manage stress and foster a secure home environment",
    ],
  },
  {
    title: "School Collaboration and Training",
    points: [
      "Partnering with schools to develop individualized support plans",
      "Teacher training on emotional regulation and social skills development",
      "Ongoing communication with educators to ensure consistent support",
    ],
  },
  {
    title: "Family Focused Sessions",
    points: [
      "Sessions involving both the child and family members",
      "Focus on improving family communication and dynamics",
      "Helping parents and siblings understand and support the child’s emotional needs",
    ],
  },
  {
    title: "Emotional and Social Skills Coaching",
    points: [
      "One-on-one coaching for children and adolescents",
      "Focus on building confidence in peer relationships and emotional expression",
      "Practical tools for handling conflict, stress, and communication challenges",
    ],
  },
  {
    title: "Transition Support",
    points: [
      "Support for children navigating key life changes (e.g., school transitions, family changes)",
      "Building emotional resilience and coping strategies",
      "Guidance for parents and teachers to ease the adjustment period",
    ],
  },
  {
    title: "Teacher and School Staff Consultation",
    points: [
      "Individual and group consultations for teachers and school counselors",
      "Guidance on managing classroom dynamics and student behavior",
      "Strategies to foster a more inclusive and supportive learning environment",
    ],
  },
  {
    title: "Collaboration with Specialists and Doctors",
    points: [
      "Partnering with pediatricians, physiotherapists, occupational therapists, psychiatrists and speech therapists",
      "Coordinating care to address complex emotional, developmental, and physical needs",
    ],
  },
  {
    title: "Group Sessions and Workshops",
    points: [
      "Parent workshops on emotional regulation and behavior management",
      "Teacher training sessions focused on building emotional resilience in the classroom",
    ],
  },
  {
    title: "Research Partnerships",
    points: [
      "Collaborating with universities and research institutions to advance understanding of child development and mental health",
      "Applying the latest research to inform and improve therapeutic approaches",
      "Conducting outcome-based studies to measure the effectiveness of interventions and refine best practices",
    ],
  },
];

const OurServices = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-800">Our Services</h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-700">{service.title}</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {service.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurServices;
