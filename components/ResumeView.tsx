import React from 'react';
import { CVData, ContactInfo } from '../types';
import { Mail, Phone, MapPin, Linkedin, Github, Briefcase, GraduationCap, Code } from 'lucide-react';

interface ResumeViewProps {
  data: CVData;
}

export const ResumeView: React.FC<ResumeViewProps> = ({ data }) => {
  if (!data) {
    return <div className="p-8 text-center text-slate-500">No resume data available.</div>;
  }

  // Helper to ensure arrays exist before mapping
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const contact = (data.contact || {}) as Partial<ContactInfo>;

  return (
    <div className="h-full overflow-y-auto bg-white p-8 shadow-inner custom-scrollbar">
      {/* Header */}
      <div className="border-b pb-6 mb-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">{data.name || 'Name Not Available'}</h1>
        <h2 className="text-xl text-blue-600 font-medium mb-4">{data.title || 'Title Not Available'}</h2>
        
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          {contact.email && (
            <div className="flex items-center gap-1">
              <Mail size={16} />
              <span>{contact.email}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-1">
              <Phone size={16} />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.location && (
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{contact.location}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-4 mt-4">
          {contact.linkedin && (
            <a href={`https://${contact.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors">
              <Linkedin size={20} />
            </a>
          )}
          {contact.github && (
            <a href={`https://${contact.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors">
              <Github size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-l-4 border-blue-500 pl-3">Summary</h3>
          <p className="text-slate-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 border-l-4 border-blue-500 pl-3">
            <Briefcase size={20} className="text-slate-900" />
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Experience</h3>
          </div>
          
          <div className="space-y-6">
            {experience.map((job, index) => (
              <div key={job.id || index} className="relative pl-4 border-l-2 border-slate-200">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                  <h4 className="text-lg font-semibold text-slate-900">{job.role}</h4>
                  <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{job.period}</span>
                </div>
                <p className="text-blue-600 font-medium mb-2">{job.company}</p>
                <p className="text-slate-700 mb-3 text-sm">{job.description}</p>
                {job.achievements && job.achievements.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-slate-600">
                    {job.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 border-l-4 border-blue-500 pl-3">
            <Code size={20} className="text-slate-900" />
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Skills</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skillGroup, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">{skillGroup.category}</h4>
                <div className="flex flex-wrap gap-2">
                  {(skillGroup.items || []).map((skill, sIdx) => (
                    <span key={sIdx} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-xs rounded-md shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4 border-l-4 border-blue-500 pl-3">
            <GraduationCap size={20} className="text-slate-900" />
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Education</h3>
          </div>
          {education.map((edu, index) => (
            <div key={edu.id || index} className="mb-4">
              <h4 className="text-lg font-semibold text-slate-900">{edu.degree}</h4>
              <div className="flex justify-between items-center text-slate-600">
                <span>{edu.institution}</span>
                <span className="text-sm bg-slate-100 px-2 py-1 rounded">{edu.year}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} {data.name || 'Candidate'}. All rights reserved.</p>
      </div>
    </div>
  );
};