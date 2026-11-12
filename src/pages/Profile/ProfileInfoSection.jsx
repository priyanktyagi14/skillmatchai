import React from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Globe,
  Building2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Input, Textarea } from '../../components/common/Input';

// SVG Brand Icons for LinkedIn and GitHub
const LinkedInIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const GitHubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const ProfileInfoSection = ({
  formData,
  errors = {},
  onChangePersonal,
  onChangeEducation
}) => {
  const { personal = {}, education = {} } = formData;
  const collegeName = education.college || education.institution || '';

  return (
    <div className="space-y-6">
      {/* 1. Basic Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <User className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>
                Primary contact information displayed on your ATS resume and campus profiles
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Full Name *"
              id="personal-fullName"
              icon={User}
              placeholder="e.g. John Doe"
              value={personal.fullName || ''}
              onChange={(e) => onChangePersonal('fullName', e.target.value)}
              error={errors.fullName}
              helperText="Enter your formal first and last name"
            />

            <Input
              label="Email Address *"
              id="personal-email"
              type="email"
              icon={Mail}
              placeholder="e.g. john.doe@example.com"
              value={personal.email || ''}
              onChange={(e) => onChangePersonal('email', e.target.value)}
              error={errors.email}
              helperText="Active email address for recruiter contact"
            />

            <Input
              label="Phone Number *"
              id="personal-phone"
              icon={Phone}
              placeholder="e.g. +91 98765 43210"
              value={personal.phone || ''}
              onChange={(e) => onChangePersonal('phone', e.target.value)}
              error={errors.phone}
              helperText="Include country code if applicable"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. College & Academic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Academic & Degree Information</CardTitle>
              <CardDescription>
                Higher education details used for campus eligibility and recruiter screening
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="College Name *"
                id="education-college"
                icon={Building2}
                placeholder="e.g. Vellore Institute of Technology (VIT)"
                value={collegeName}
                onChange={(e) => {
                  onChangeEducation('college', e.target.value);
                  onChangeEducation('institution', e.target.value);
                }}
                error={errors.college}
                helperText="Official university or institute name"
              />
            </div>

            <Input
              label="Degree *"
              id="education-degree"
              icon={Award}
              placeholder="e.g. Bachelor of Technology (B.Tech)"
              value={education.degree || ''}
              onChange={(e) => onChangeEducation('degree', e.target.value)}
              error={errors.degree}
              helperText="e.g. B.Tech, B.E., B.Sc, BCA, MCA"
            />

            <Input
              label="Branch / Specialization *"
              id="education-branch"
              icon={BookOpen}
              placeholder="e.g. Computer Science and Engineering"
              value={education.branch || ''}
              onChange={(e) => onChangeEducation('branch', e.target.value)}
              error={errors.branch}
              helperText="e.g. Computer Science, Information Technology, AI & Data Science"
            />

            <Input
              label="Graduation Year *"
              id="education-graduationYear"
              icon={Calendar}
              placeholder="e.g. 2025"
              value={education.graduationYear || ''}
              onChange={(e) => onChangeEducation('graduationYear', e.target.value)}
              error={errors.graduationYear}
              helperText="Four-digit completion or expected graduation year"
            />

            <Input
              label="CGPA / Percentage (Optional)"
              id="education-cgpa"
              icon={Award}
              placeholder="e.g. 8.72 / 10.0 or 85%"
              value={education.cgpa || ''}
              onChange={(e) => onChangeEducation('cgpa', e.target.value)}
              error={errors.cgpa}
              helperText="Academic performance metric (optional)"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Professional Links & Social Profiles */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Professional Profiles & Links</CardTitle>
              <CardDescription>
                Direct verifiable URLs for technical recruiters to evaluate your code and network
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="LinkedIn URL (Optional)"
              id="personal-linkedin"
              icon={LinkedInIcon}
              placeholder="https://linkedin.com/in/username"
              value={personal.linkedin || ''}
              onChange={(e) => onChangePersonal('linkedin', e.target.value)}
              error={errors.linkedin}
              helperText="Link to your public LinkedIn profile"
            />

            <Input
              label="GitHub URL (Optional)"
              id="personal-github"
              icon={GitHubIcon}
              placeholder="https://github.com/username"
              value={personal.github || ''}
              onChange={(e) => onChangePersonal('github', e.target.value)}
              error={errors.github}
              helperText="Link to your public GitHub profile or portfolio"
            />
          </div>

          <Textarea
            label="Professional Summary / Bio (Optional)"
            id="personal-summary"
            rows={3}
            placeholder="Proactive B.Tech Computer Science graduate with strong hands-on problem solving skills in Data Structures and Modern Full-Stack web architectures..."
            value={personal.summary || ''}
            onChange={(e) => onChangePersonal('summary', e.target.value)}
            helperText="2-3 concise sentences summarizing your CS degree, core technologies, and career aspiration."
          />
        </CardContent>
      </Card>
    </div>
  );
};
