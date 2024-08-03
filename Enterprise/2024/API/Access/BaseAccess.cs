using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Per.Data.Context;

namespace Per.Data.Access
{
    public abstract class BaseAccess
    {

        protected readonly PerDBContext _context;

        public BaseAccess(PerDBContext context)
        {
            _context = context;
        }
    }
}
